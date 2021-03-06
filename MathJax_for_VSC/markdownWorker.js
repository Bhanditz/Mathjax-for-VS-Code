/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */
function Lexer(e) {
    this.tokens = [],
    this.tokens.links = {},
    this.options = e || marked.defaults,
    this.rules = block.normal,
    this.options.gfm && (this.options.tables ? this.rules = block.tables: this.rules = block.gfm)
}
function InlineLexer(e, t) {
    if (this.options = t || marked.defaults, this.links = e, this.rules = inline.normal, this.renderer = this.options.renderer || new Renderer, this.renderer.options = this.options, !this.links) throw new Error("Tokens array requires a `links` property.");
    this.options.gfm ? this.options.breaks ? this.rules = inline.breaks: this.rules = inline.gfm: this.options.pedantic && (this.rules = inline.pedantic)
}
function Renderer(e) {
    this.options = e || {}
}
function Parser(e) {
    this.tokens = [],
    this.token = null,
    this.options = e || marked.defaults,
    this.options.renderer = this.options.renderer || new Renderer,
    this.renderer = this.options.renderer,
    this.renderer.options = this.options
}
function escape(e, t) {
    return e.replace(t ? /&/g: /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
}
function unescape(e) {
    return e.replace(/&([#\w]+);/g,
    function(e, t) {
        return t = t.toLowerCase(),
        "colon" === t ? ":": "#" === t.charAt(0) ? "x" === t.charAt(1) ? String.fromCharCode(parseInt(t.substring(2), 16)) : String.fromCharCode( + t.substring(1)) : ""
    })
}
function replace(e, t) {
    return e = e.source,
    t = t || "",
    function r(n, i) {
        return n ? (i = i.source || i, i = i.replace(/(^|[^\[])\^/g, "$1"), e = e.replace(n, i), r) : new RegExp(e, t)
    }
}
function noop() {}
function merge(e) {
    for (var t, r, n = 1; n < arguments.length; n++) {
        t = arguments[n];
        for (r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
    }
    return e
}
function marked(e, t, r) {
    if (r || "function" == typeof t) {
        r || (r = t, t = null),
        t = merge({},
        marked.defaults, t || {});
        var n, i, s = t.highlight,
        o = 0;
        try {
            n = Lexer.lex(e, t)
        } catch(l) {
            return r(l)
        }
        i = n.length;
        var a = function(e) {
            if (e) return t.highlight = s,
            r(e);
            var i;
            try {
                i = Parser.parse(n, t)
            } catch(o) {
                e = o
            }
            return t.highlight = s,
            e ? r(e) : r(null, i)
        };
        if (!s || s.length < 3) return a();
        if (delete t.highlight, !i) return a();
        for (; o < n.length; o++) !
        function(e) {
            return "code" !== e.type ? --i || a() : s(e.text, e.lang,
            function(t, r) {
                return t ? a(t) : null == r || r === e.text ? --i || a() : (e.text = r, e.escaped = !0, void(--i || a()))
            })
        } (n[o])
    } else try {
        return t && (t = merge({},
        marked.defaults, t)),
        Parser.parse(Lexer.lex(e, t), t)
    } catch(l) {
        if (l.message += "\nPlease report this to https://github.com/chjj/marked.", (t || marked.defaults).silent) return "<p>An error occured:</p><pre>" + escape(l.message + "", !0) + "</pre>";
        throw l
    }
}
var block = {
    newline: /^\n+/,
    code: /^( {4}[^\n]+\n*)+/,
    //fences: noop,
    mathjax: /^ *(\${2}) *([\s\S]+?)\s*\1 *(?:\n+|$)/,
    hr: /^( *[-*_]){3,} *(?:\n+|$)/,
    heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
    nptable: noop,
    lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
    blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
    list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
    html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
    table: noop,
    paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
    text: /^[^\n]+/
};
block.bullet = /(?:[*+-]|\d+\.)/,
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/,
block.item = replace(block.item, "gm")(/bull/g, block.bullet)(),
block.list = replace(block.list)(/bull/g, block.bullet)("hr", "\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def", "\\n+(?=" + block.def.source + ")")(),
block.blockquote = replace(block.blockquote)("def", block.def)(),
block._tag = "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b",
block.html = replace(block.html)("comment", /<!--[\s\S]*?-->/)("closed", /<(tag)[\s\S]+?<\/\1>/)("closing", /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, block._tag)(),
block.paragraph = replace(block.paragraph)("hr", block.hr)("heading", block.heading)("lheading", block.lheading)("blockquote", block.blockquote)("tag", "<" + block._tag)("def", block.def)(),
block.normal = merge({},
block),
block.gfm = merge({},
block.normal, {
    fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
    paragraph: /^/
}),
block.gfm.paragraph = replace(block.paragraph)("(?!", "(?!" + block.gfm.fences.source.replace("\\1", "\\2") + "|" + block.list.source.replace("\\1", "\\3") + "|")(),
block.tables = merge({},
block.gfm, {
    nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
    table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
}),
Lexer.rules = block,
Lexer.lex = function(e, t) {
    var r = new Lexer(t);
    return r.lex(e)
},
Lexer.prototype.lex = function(e) {
    return e = e.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ").replace(/\u00a0/g, " ").replace(/\u2424/g, "\n"),
    this.token(e, !0)
},
Lexer.prototype.token = function(e, t, r) {
    for (var n, i, s, o, l, a, h, c, u, e = e.replace(/^ +$/gm, ""); e;) if ((s = this.rules.newline.exec(e)) && (e = e.substring(s[0].length), s[0].length > 1 && this.tokens.push({
            type: "space"
    })), s = this.rules.code.exec(e)) e = e.substring(s[0].length),
    s = s[0].replace(/^ {4}/gm, ""),
    this.tokens.push({
        type: "code",
        text: this.options.pedantic ? s: s.replace(/\n+$/, "")
    });
    else if (s = this.rules.mathjax.exec(e)) e = e.substring(s[0].length), 
    this.tokens.push({
        type: "html",
        pre : true,
        text: s[0]
    });
    else if (s = this.rules.fences.exec(e)) e = e.substring(s[0].length),
    this.tokens.push({
        type: "code",
        lang: s[2],
        text: s[3]
    });
    else if (s = this.rules.heading.exec(e)) e = e.substring(s[0].length),
    this.tokens.push({
        type: "heading",
        depth: s[1].length,
        text: s[2]
    });
    else if (t && (s = this.rules.nptable.exec(e))) {
        for (e = e.substring(s[0].length), a = {
            type: "table",
            header: s[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
            align: s[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
            cells: s[3].replace(/\n$/, "").split("\n")
        },
        c = 0; c < a.align.length; c++) / ^*-+:*$ / .test(a.align[c]) ? a.align[c] = "right": /^ *:-+: *$/.test(a.align[c]) ? a.align[c] = "center": /^ *:-+ *$/.test(a.align[c]) ? a.align[c] = "left": a.align[c] = null;
        for (c = 0; c < a.cells.length; c++) a.cells[c] = a.cells[c].split(/ *\| */);
        this.tokens.push(a)
    } else if (s = this.rules.lheading.exec(e)) e = e.substring(s[0].length),
    this.tokens.push({
        type: "heading",
        depth: "=" === s[2] ? 1 : 2,
        text: s[1]
    });
    else if (s = this.rules.hr.exec(e)) e = e.substring(s[0].length),
    this.tokens.push({
        type: "hr"
    });
    else if (s = this.rules.blockquote.exec(e)) e = e.substring(s[0].length),
    this.tokens.push({
        type: "blockquote_start"
    }),
    s = s[0].replace(/^ *> ?/gm, ""),
    this.token(s, t, !0),
    this.tokens.push({
        type: "blockquote_end"
    });
    else if (s = this.rules.list.exec(e)) {
        for (e = e.substring(s[0].length), o = s[2], this.tokens.push({
            type: "list_start",
            ordered: o.length > 1
        }), s = s[0].match(this.rules.item), n = !1, u = s.length, c = 0; u > c; c++) a = s[c],
        h = a.length,
        a = a.replace(/^ *([*+-]|\d+\.) +/, ""),
        ~a.indexOf("\n ") && (h -= a.length, a = this.options.pedantic ? a.replace(/^ {1,4}/gm, "") : a.replace(new RegExp("^ {1," + h + "}", "gm"), "")),
        this.options.smartLists && c !== u - 1 && (l = block.bullet.exec(s[c + 1])[0], o === l || o.length > 1 && l.length > 1 || (e = s.slice(c + 1).join("\n") + e, c = u - 1)),
        i = n || /\n\n(?!\s*$)/.test(a),
        c !== u - 1 && (n = "\n" === a.charAt(a.length - 1), i || (i = n)),
        this.tokens.push({
            type: i ? "loose_item_start": "list_item_start"
        }),
        this.token(a, !1, r),
        this.tokens.push({
            type: "list_item_end"
        });
        this.tokens.push({
            type: "list_end"
        })
    } else if (s = this.rules.html.exec(e)) e = e.substring(s[0].length),
    this.tokens.push({
        type: this.options.sanitize ? "paragraph": "html",
        pre: "pre" === s[1] || "script" === s[1] || "style" === s[1],
        text: s[0]
    });
    else if (!r && t && (s = this.rules.def.exec(e))) e = e.substring(s[0].length),
    this.tokens.links[s[1].toLowerCase()] = {
        href: s[2],
        title: s[3]
    };
    else if (t && (s = this.rules.table.exec(e))) {
        for (e = e.substring(s[0].length), a = {
            type: "table",
            header: s[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
            align: s[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
            cells: s[3].replace(/(?: *\| *)?\n$/, "").split("\n")
        },
        c = 0; c < a.align.length; c++) / ^*-+:*$ / .test(a.align[c]) ? a.align[c] = "right": /^ *:-+: *$/.test(a.align[c]) ? a.align[c] = "center": /^ *:-+ *$/.test(a.align[c]) ? a.align[c] = "left": a.align[c] = null;
        for (c = 0; c < a.cells.length; c++) a.cells[c] = a.cells[c].replace(/^ *\| *| *\| *$/g, "").split(/ *\| */);
        this.tokens.push(a)
    } else if (t && (s = this.rules.paragraph.exec(e))) e = e.substring(s[0].length),
    this.tokens.push({
        type: "paragraph",
        text: "\n" === s[1].charAt(s[1].length - 1) ? s[1].slice(0, -1) : s[1]
    });
    else if (s = this.rules.text.exec(e)) e = e.substring(s[0].length),
    this.tokens.push({
        type: "text",
        text: s[0]
    });
    else if (e) throw new Error("Infinite loop on byte: " + e.charCodeAt(0));
    return this.tokens
};
var inline = {
    escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
    autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
    url: noop,
    mathjax: /^(\${1,2})\s*([\s\S]*?[^\$])\s*\1(?!\$)/,
    tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
    link: /^!?\[(inside)\]\(href\)/,
    reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
    nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
    strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
    em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
    code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
    br: /^ {2,}\n(?!\s*$)/,
    del: noop,
    //text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
    text: /^[\s\S]+?(?=[\\<!\[_*`\$]| {2,}\n|$)/
};
inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/,
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/,
inline.link = replace(inline.link)("inside", inline._inside)("href", inline._href)(),
inline.reflink = replace(inline.reflink)("inside", inline._inside)(),
inline.normal = merge({},
inline),
inline.pedantic = merge({},
inline.normal, {
    strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
}),
inline.gfm = merge({},
inline.normal, {
    escape: replace(inline.escape)("])", "~|])")(),
    url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
    del: /^~~(?=\S)([\s\S]*?\S)~~/,
    text: replace(inline.text)("]|", "~]|")("|", "|https?://|")()
}),
inline.breaks = merge({},
inline.gfm, {
    br: replace(inline.br)("{2,}", "*")(),
    text: replace(inline.gfm.text)("{2,}", "*")()
}),
InlineLexer.rules = inline,
InlineLexer.output = function(e, t, r) {
    var n = new InlineLexer(t, r);
    return n.output(e)
},
InlineLexer.prototype.output = function(e) {
    for (var t, r, n, i, s = ""; e;) if (i = this.rules.escape.exec(e)) e = e.substring(i[0].length),
    s += i[1];
    else if (i = this.rules.autolink.exec(e)) e = e.substring(i[0].length),
    "@" === i[2] ? (r = ":" === i[1].charAt(6) ? this.mangle(i[1].substring(7)) : this.mangle(i[1]), n = this.mangle("mailto:") + r) : (r = escape(i[1]), n = r),
    s += this.renderer.link(n, null, r);
    else if (this.inLink || !(i = this.rules.url.exec(e))) {
        if (i = this.rules.tag.exec(e)) ! this.inLink && /^<a /i.test(i[0]) ? this.inLink = !0 : this.inLink && /^<\/a>/i.test(i[0]) && (this.inLink = !1),
        e = e.substring(i[0].length),
        s += this.options.sanitize ? escape(i[0]) : i[0];
        else if (i = this.rules.link.exec(e)) e = e.substring(i[0].length),
        this.inLink = !0,
        s += this.outputLink(i, {
            href: i[2],
            title: i[3]
        }),
        this.inLink = !1;
        else if ((i = this.rules.reflink.exec(e)) || (i = this.rules.nolink.exec(e))) {
            if (e = e.substring(i[0].length), t = (i[2] || i[1]).replace(/\s+/g, " "), t = this.links[t.toLowerCase()], !t || !t.href) {
                s += i[0].charAt(0),
                e = i[0].substring(1) + e;
                continue
            }
            this.inLink = !0,
            s += this.outputLink(i, t),
            this.inLink = !1
        } else if (i = this.rules.strong.exec(e)) e = e.substring(i[0].length),
        s += this.renderer.strong(this.output(i[2] || i[1]));
        else if (i = this.rules.em.exec(e)) e = e.substring(i[0].length),
        s += this.renderer.em(this.output(i[2] || i[1]));
        else if (i = this.rules.code.exec(e)) e = e.substring(i[0].length),
        s += this.renderer.codespan(escape(i[2], !0));
        else if (o = this.rules.mathjax.exec(e)) e = e.substring(o[0].length), s += o[0];
        else if (i = this.rules.br.exec(e)) e = e.substring(i[0].length),
        s += this.renderer.br();
        else if (i = this.rules.del.exec(e)) e = e.substring(i[0].length),
        s += this.renderer.del(this.output(i[1]));
        else if (i = this.rules.text.exec(e)) e = e.substring(i[0].length),
        s += escape(this.smartypants(i[0]));
        else if (e) throw new Error("Infinite loop on byte: " + e.charCodeAt(0))
    } else e = e.substring(i[0].length),
    r = escape(i[1]),
    n = r,
    s += this.renderer.link(n, null, r);
    return s
},
InlineLexer.prototype.outputLink = function(e, t) {
    var r = escape(t.href),
    n = t.title ? escape(t.title) : null;
    return "!" !== e[0].charAt(0) ? this.renderer.link(r, n, this.output(e[1])) : this.renderer.image(r, n, escape(e[1]))
},
InlineLexer.prototype.smartypants = function(e) {
    return e
},
InlineLexer.prototype.mangle = function(e) {
    for (var t, r = "",
    n = e.length,
    i = 0; n > i; i++) t = e.charCodeAt(i),
    Math.random() > .5 && (t = "x" + t.toString(16)),
    r += "&#" + t + ";";
    return r
},
Renderer.prototype.code = function(e, t, r) {
    if (this.options.highlight) {
        var n = this.options.highlight(e, t);
        null != n && n !== e && (r = !0, e = n)
    }
    return t ? '<pre><code class="' + this.options.langPrefix + escape(t, !0) + '">' + (r ? e: escape(e, !0)) + "\n</code></pre>\n": "<pre><code>" + (r ? e: escape(e, !0)) + "\n</code></pre>"
},
Renderer.prototype.blockquote = function(e) {
    return "<blockquote>\n" + e + "</blockquote>\n"
},
Renderer.prototype.html = function(e) {
    return e
},
Renderer.prototype.heading = function(e, t, r) {
    return "<h" + t + ' id="' + this.options.headerPrefix + r.toLowerCase().replace(/[^\w]+/g, "-") + '">' + e + "</h" + t + ">\n"
},
Renderer.prototype.hr = function() {
    return this.options.xhtml ? "<hr/>\n": "<hr>\n"
},
Renderer.prototype.list = function(e, t) {
    var r = t ? "ol": "ul";
    return "<" + r + ">\n" + e + "</" + r + ">\n"
},
Renderer.prototype.listitem = function(e) {
    return "<li>" + e + "</li>\n"
},
Renderer.prototype.paragraph = function(e) {
    return "<p>" + e + "</p>\n"
},
Renderer.prototype.table = function(e, t) {
    return "<table>\n<thead>\n" + e + "</thead>\n<tbody>\n" + t + "</tbody>\n</table>\n"
},
Renderer.prototype.tablerow = function(e) {
    return "<tr>\n" + e + "</tr>\n"
},
Renderer.prototype.tablecell = function(e, t) {
    var r = t.header ? "th": "td",
    n = t.align ? "<" + r + ' style="text-align:' + t.align + '">': "<" + r + ">";
    return n + e + "</" + r + ">\n"
},
Renderer.prototype.strong = function(e) {
    return "<strong>" + e + "</strong>"
},
Renderer.prototype.em = function(e) {
    return "<em>" + e + "</em>"
},
Renderer.prototype.codespan = function(e) {
    return "<code>" + e + "</code>"
},
Renderer.prototype.br = function() {
    return this.options.xhtml ? "<br/>": "<br>"
},
Renderer.prototype.del = function(e) {
    return "<del>" + e + "</del>"
},
Renderer.prototype.link = function(e, t, r) {
    if (this.options.sanitize) {
        try {
            var n = decodeURIComponent(unescape(e)).replace(/[^\w:]/g, "").toLowerCase()
        } catch(i) {
            return ""
        }
        if (0 === n.indexOf("javascript:")) return ""
    }
    var s = '<a href="' + e + '"';
    return t && (s += ' title="' + t + '"'),
    s += ">" + r + "</a>"
},
Renderer.prototype.image = function(e, t, r) {
    var n = '<img src="' + e + '" alt="' + r + '"';
    return t && (n += ' title="' + t + '"'),
    n += this.options.xhtml ? "/>": ">"
},
Parser.parse = function(e, t, r) {
    var n = new Parser(t, r);
    return n.parse(e)
},
Parser.prototype.parse = function(e) {
    this.inline = new InlineLexer(e.links, this.options, this.renderer),
    this.tokens = e.reverse();
    for (var t = ""; this.next();) t += this.tok();
    return t
},
Parser.prototype.next = function() {
    return this.token = this.tokens.pop()
},
Parser.prototype.peek = function() {
    return this.tokens[this.tokens.length - 1] || 0
},
Parser.prototype.parseText = function() {
    for (var e = this.token.text;
    "text" === this.peek().type;) e += "\n" + this.next().text;
    return this.inline.output(e)
},
Parser.prototype.tok = function() {
    switch (this.token.type) {
        case "space":
            return "";
        case "hr":
            return this.renderer.hr();
        case "heading":
            return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, this.token.text);
        case "code":
            return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
        case "table":
            var e, t, r, n, i, s = "",
            o = "";
            for (r = "", e = 0; e < this.token.header.length; e++) n = {
                header: !0,
                align: this.token.align[e]
            },
            r += this.renderer.tablecell(this.inline.output(this.token.header[e]), {
                header: !0,
                align: this.token.align[e]
            });
            for (s += this.renderer.tablerow(r), e = 0; e < this.token.cells.length; e++) {
                for (t = this.token.cells[e], r = "", i = 0; i < t.length; i++) r += this.renderer.tablecell(this.inline.output(t[i]), {
                    header: !1,
                    align: this.token.align[i]
                });
                o += this.renderer.tablerow(r)
            }
            return this.renderer.table(s, o);
        case "blockquote_start":
            for (var o = "";
            "blockquote_end" !== this.next().type;) o += this.tok();
            return this.renderer.blockquote(o);
        case "list_start":
            for (var o = "",
            l = this.token.ordered;
            "list_end" !== this.next().type;) o += this.tok();
            return this.renderer.list(o, l);
        case "list_item_start":
            for (var o = "";
            "list_item_end" !== this.next().type;) o += "text" === this.token.type ? this.parseText() : this.tok();
            return this.renderer.listitem(o);
        case "loose_item_start":
            for (var o = "";
            "list_item_end" !== this.next().type;) o += this.tok();
            return this.renderer.listitem(o);
        case "html":
            var a = this.token.pre || this.options.pedantic ? this.token.text: this.inline.output(this.token.text);
            return this.renderer.html(a);
        case "paragraph":
            return this.renderer.paragraph(this.inline.output(this.token.text));
        case "text":
            return this.renderer.paragraph(this.parseText())
    }
},
noop.exec = noop,
marked.options = marked.setOptions = function(e) {
    return merge(marked.defaults, e),
    marked
},
marked.defaults = {
    gfm: !0,
    tables: !0,
    breaks: !1,
    pedantic: !1,
    sanitize: !1,
    smartLists: !1,
    silent: !1,
    highlight: null,
    langPrefix: "lang-",
    smartypants: !1,
    headerPrefix: "",
    renderer: new Renderer,
    xhtml: !1
},
marked.Parser = Parser,
marked.parser = Parser.parse,
marked.Renderer = Renderer,
marked.Lexer = Lexer,
marked.lexer = Lexer.lex,
marked.InlineLexer = InlineLexer,
marked.inlineLexer = InlineLexer.output,
marked.parse = marked,
this.marked = marked,
define("vs/base/common/marked/raw.marked", [],
function() {
    return this.marked
}),
require.config({
    shim: {
        "vs/base/common/marked/raw.marked": {
            exports: function() {
                return this.marked
            }
        }
    }
}),
define("vs/base/common/marked/marked", ["./raw.marked"],
function(e) {
    return {
        marked: e
    }
}),
define("vs/editor/common/modes/textToHtmlTokenizer", ["require", "exports", "vs/base/common/strings", "vs/editor/common/modes/nullMode"],
function(e, t, r, n) {
    "use strict";
    function i(e, t) {
        return l(e, o(t))
    }
    function s(e, t, r) {
        return a(e, o(t), r)
    }
    function o(e) {
        return e && e.tokenizationSupport ? e.tokenizationSupport: {
            shouldGenerateEmbeddedModels: !1,
            getInitialState: function() {
                return new n.NullState(null, null)
            },
            tokenize: function(e, t, r, i) {
                return void 0 === r && (r = 0),
                n.nullTokenize(null, e, t, r, i)
            }
        }
    }
    function l(e, t) {
        var r = {
            tagName: "div",
            style: "white-space: pre-wrap",
            children: []
        },
        n = function(e, t) {
            r.children.push({
                tagName: "span",
                className: e,
                text: t
            })
        },
        i = function() {
            r.children.push({
                tagName: "br"
            })
        };
        return h(e, t, n, i),
        r
    }
    function a(e, t, n) {
        void 0 === n && (n = ""),
        n && n.length > 0 && (n = " " + n);
        var i = "",
        s = function(e, t) {
            i += '<span class="' + e + n + '">' + r.escape(t) + "</span>"
        },
        o = function() {
            i += "<br/>"
        };
        return i = '<div style="white-space: pre-wrap;">',
        h(e, t, s, o),
        i += "</div>"
    }
    function h(e, t, r, n) {
        for (var i = e.split(/\r\n|\r|\n/), s = t.getInitialState(), o = 0; o < i.length; o++) s = c(i[o], t, r, s),
        o < i.length - 1 && n()
    }
    function c(e, t, r, n) {
        for (var i, s = t.tokenize(e, n), o = s.endState, l = s.tokens, a = 0, h = 0; h < l.length; h++) {
            var c = l[h];
            h < l.length - 1 ? (i = e.substring(a, l[h + 1].startIndex), a = l[h + 1].startIndex) : i = e.substr(a);
            var u = "token",
            p = c.type.replace(/[^a-z0-9\-]/gi, " ");
            p.length > 0 && (u += " " + p),
            r(u, i)
        }
        return o
    }
    t.tokenizeToHtmlContent = i,
    t.tokenizeToString = s
});
var __decorate = this && this.__decorate ||
function(e, t, r, n) {
    var i, s = arguments.length,
    o = 3 > s ? t: null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(e, t, r, n);
    else for (var l = e.length - 1; l >= 0; l--)(i = e[l]) && (o = (3 > s ? i(o) : s > 3 ? i(t, r, o) : i(t, r)) || o);
    return s > 3 && o && Object.defineProperty(t, r, o),
    o
},
__param = this && this.__param ||
function(e, t) {
    return function(r, n) {
        t(r, n, e)
    }
};
define("vs/languages/markdown/common/markdownWorker", ["require", "exports", "vs/base/common/winjs.base", "vs/base/common/uri", "vs/base/common/types", "vs/base/common/paths", "vs/base/common/marked/marked", "vs/editor/common/modes/textToHtmlTokenizer", "vs/base/common/platform", "vs/editor/common/services/modeService", "vs/editor/common/services/resourceService", "vs/platform/markers/common/markers"],
function(e, t, r, n, i, s, o, l, a, h, c, u) {
    "use strict";
    var p; !
    function(e) {
        e[e.LIGHT = 0] = "LIGHT",
        e[e.DARK = 1] = "DARK",
        e[e.HC_BLACK = 2] = "HC_BLACK"
    } (p || (p = {}));
    var d = function() {
        function e(e, t, r, n) {
            this.theme = p.DARK,
            this._modeId = e,
            this.resourceService = t,
            this.markerService = r,
            this.modeService = n
        }
        return e.prototype._doConfigure = function(e) {
            return e && e.theme && (this.theme = "vs-dark" === e.theme ? p.DARK: "vs" === e.theme ? p.LIGHT: p.HC_BLACK),
            e && i.isArray(e.styles) && (this.cssLinks = e.styles),
            r.TPromise.as(void 0)
        },
        e.prototype.getEmitOutput = function(t, n) {
            var i = this,
            s = this.resourceService.get(t),
            h = this.cssLinks || [],
            c = new o.marked.Renderer,
            u = this;
            c.image = function(e, r, n) {
                var i = '<img src="' + u.fixHref(t, e) + '" alt="' + n + '"';
                return r && (i += ' title="' + r + '"'),
                i += this.options && this.options.xhtml ? "/>": ">"
            };
            var d = c.link;
            c.link = function(e, t, r) {
                var n = d.call(this, e, t, r);
                return n = e && "#" === e[0] ? n.replace("href=", "localhref=") : n.replace("<a", '<a target="_blank"')
            };
            var g = this.modeService,
            k = function(t, r, n) {
                var i = g.getModeIdForLanguageName(r) || r || e.DEFAULT_MODE;
                g.getOrCreateMode(i).then(function(e) {
                    n(null, l.tokenizeToString(t, e))
                })
            };
            return new r.Promise(function(r, l) {
                o.marked(s.getValue(), {
                    gfm: !0,
                    renderer: c,
                    highlight: k
                },
                function(s, o) {
                    var l = ["<!DOCTYPE html>", "<html>", "<head>", '<meta http-equiv="Content-type" content="text/html;charset=UTF-8">', 0 === h.length ? '<link rel="stylesheet" href="' + n + '/markdown.css" type="text/css" media="screen">': "", 0 === h.length ? '<link rel="stylesheet" href="' + n + '/tokens.css" type="text/css" media="screen">': "", i.theme === p.LIGHT ? e.LIGHT_SCROLLBAR_CSS: i.theme === p.DARK ? e.DARK_SCROLLBAR_CSS: e.HC_BLACK_SCROLLBAR_CSS, h.map(function(e) {
                        return '<link rel="stylesheet" href="' + i.fixHref(t, e) + '" type="text/css" media="screen">'
                    }).join("\n"),'<script type="text/x-mathjax-config">', "MathJax.Hub.Config({", "showProcessingMessages:false,", "tex2jax:{inlineMath:[['$','$'],['\\\\(','\\\\)']]},", "TeX:{equationNumbers:{autoNumber:['AMS'], useLabelIds: true}}, 'HTML-CSS':{linebreaks:{automatic:true}, scale:120}, SVG:{linebreaks:{automatic: true}}", "});", "document.addEventListener('DOMSubtreeModified',function(){MathJax.Hub.Queue(['Typeset',MathJax.Hub]);},false);", "</script>", '<script src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>', 
                    "</head>", a.isMacintosh ? '<body class="mac">': "<body>"].join("\n"),
                    c = [i.theme === p.LIGHT ? '<div class="monaco-editor vs">': i.theme === p.DARK ? '<div class="monaco-editor vs-dark">': '<div class="monaco-editor hc-black">', o, "</div>"].join("\n"),
                    u = ["</body>", "</html>"].join("\n");
                    r({
                        head: l,
                        body: c,
                        tail: u
                    })
                })
            })
        },
        e.prototype.fixHref = function(e, t) {
            return t ? n["default"].parse(t).scheme ? t: n["default"].file(s.join(s.dirname(e.fsPath), t)).toString() : t
        },
        e.DEFAULT_MODE = "text/plain",
        e.LIGHT_SCROLLBAR_CSS = ['<style type="text/css">', "	::-webkit-scrollbar {", "		width: 14px;", "		height: 14px;", "	}", "", "	::-webkit-scrollbar-thumb {", "		background-color: rgba(100, 100, 100, 0.4);", "	}", "", "	::-webkit-scrollbar-thumb:hover {", "		background-color: rgba(100, 100, 100, 0.7);", "	}", "", "	::-webkit-scrollbar-thumb:active {", "		background-color: rgba(0, 0, 0, 0.6);", "	}", "</style>"].join("\n"),
        e.DARK_SCROLLBAR_CSS = ['<style type="text/css">', "	::-webkit-scrollbar {", "		width: 14px;", "		height: 14px;", "	}", "", "	::-webkit-scrollbar-thumb {", "		background-color: rgba(121, 121, 121, 0.4);", "	}", "", "	::-webkit-scrollbar-thumb:hover {", "		background-color: rgba(100, 100, 100, 0.7);", "	}", "", "	::-webkit-scrollbar-thumb:active {", "		background-color: rgba(85, 85, 85, 0.8);", "	}", "</style>"].join("\n"),
        e.HC_BLACK_SCROLLBAR_CSS = ['<style type="text/css">', "	::-webkit-scrollbar {", "		width: 14px;", "		height: 14px;", "	}", "", "	::-webkit-scrollbar-thumb {", "		background-color: rgba(111, 195, 223, 0.3);", "	}", "", "	::-webkit-scrollbar-thumb:hover {", "		background-color: rgba(111, 195, 223, 0.4);", "	}", "", "	::-webkit-scrollbar-thumb:active {", "		background-color: rgba(111, 195, 223, 0.4);", "	}", "</style>"].join("\n"),
        e = __decorate([__param(1, c.IResourceService), __param(2, u.IMarkerService), __param(3, h.IModeService)], e)
    } ();
    t.MarkdownWorker = d
});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/fe7f407b95b7f78405846188259504b34ef72761/vs\languages\markdown\common\markdownWorker.js.map
