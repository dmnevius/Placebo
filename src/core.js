(function (context) {
    'use strict';
    function build(elements, data, loadOrder, load, special, def, done) {
        var element = elements[elements.length - 1],
            child,
            prev,
            i;
        if (element.children.length > 0) {
            element = element.children[element.children.length - 1];
        }
        if (!data.extra || Object.getOwnPropertyNames(data.extra).length === 0) {
            return [elements, loadOrder, special, done];
        } else {
            if (data.extra['class']) {
                element.setAttribute("class", ((element.getAttribute("class") || "") + " " + data.extra['class']).replace(/^\s/, ""));
            } else if (data.extra.id) {
                element.setAttribute("id", ((element.getAttribute("id") || "") + " " + data.extra.id).replace(/^\s/, ""));
            } else if (data.extra.node) {
                elements.push(document.createElement(data.extra.node));
                load += 1;
                loadOrder.push(load);
                special.push(def);
            } else if (data.extra.contains) {
                if (!element.getAttribute("data-placebo-prevent-children")) {
                    child = document.createElement(data.extra.contains);
                    element.appendChild(child);
                }
            } else if (data.extra.child) {
                if (!element.getAttribute("data-placebo-prevent-children")) {
                    child = document.createElement(data.extra.child);
                    element.appendChild(child);
                }
            } else if (data.extra.immediate_child) {
                elements.push(document.createElement(data.extra.immediate_child));
                load += 1;
                loadOrder.push(load);
                special.push(def);
            } else if (data.extra.after) {
                elements.push(document.createElement(data.extra.after));
                load += 1;
                loadOrder.splice(0, 0, load);
                special.push(def);
            } else if (data.extra.attr) {
                element.setAttribute(data.extra.attr, "");
            } else if (data.extra.attr_is) {
                element.setAttribute(data.extra.attr_is, data.extra.value);
            } else if (data.extra.attr_has_word) {
                element.setAttribute(data.extra.attr_has_word, data.extra.value);
            } else if (data.extra.attr_starts_hyphen) {
                element.setAttribute(data.extra.attr_starts_hyphen, data.extra.value);
            } else if (data.extra.attr_starts) {
                element.setAttribute(data.extra.attr_starts, data.extra.value);
            } else if (data.extra.attr_ends) {
                element.setAttribute(data.extra.attr_ends, data.extra.value);
            } else if (data.extra.attr_has) {
                element.setAttribute(data.extra.attr_has, data.extra.value);
            } else if (data.extra.pseudo) {
                if (data.extra.pseudo === "checked") {
                    element.checked = true;
                } else if (data.extra.pseudo === "disabled") {
                    element.disabled = true;
                } else if (data.extra.pseudo === "empty") {
                    element.innerHTML = "";
                    element.setAttribute("data-placebo-prevent-children", "true");
                } else if (data.extra.pseudo === "enabled") {
                    element.disabled = false;
                } else if (data.extra.pseudo === "first-child") {
                    special[special.length - 1] = function (e, p) {
                        p.insertBefore(e, p.childNodes[0]);
                    };
                } else if (data.extra.pseudo === "first-of-type") {
                    special[special.length - 1] = function (e, p) {
                        var found = false,
                            i;
                        for (i = 0; i < p.children.length; i += 1) {
                            if (p.children[i].nodeName === element.nodeName && !found) {
                                found = true;
                                p.insertBefore(e, p.children[i]);
                            }
                        }
                        if (!found) {
                            p.appendChild(e);
                        }
                    };
                } else if (data.extra.pseudo === "focus") {
                    done.push(function () {
                        element.focus();
                    });
                } else if (data.extra.pseudo === "in-range") {
                    if (element.getAttribute("min") && element.getAttribute("max")) {
                        element.setAttribute("value", Math.floor((Math.random() * Number(element.getAttribute("max"))) + Number(element.getAttribute("min"))));
                    } else if (element.getAttribute("max")) {
                        element.setAttribute("value", Math.floor((Math.random() * Number(element.getAttribute("max")))));
                    } else if (element.getAttribute("min")) {
                        element.setAttribute("value", Math.floor((Math.random() * (Number(element.getAttribute("min")) * 2)) + Number(element.getAttribute("min"))));
                    }
                } else if (data.extra.pseudo === "lang") {
                    element.setAttribute("lang", data.extra.value);
                } else if (data.extra.pseudo === "last-of-type") {
                    special[special.length - 1] = function (e, p) {
                        var found = false,
                            pre,
                            i;
                        for (i = 0; i < p.children.length; i += 1) {
                            if (p.children[i].nodeName === element.nodeName) {
                                pre = p.children[i];
                                found = true;
                            }
                        }
                        if (found && pre.nextElementSibling) {
                            p.insertBefore(e, pre.nextElementSibling);
                        } else {
                            p.appendChild(e);
                        }
                    };
                } else if (data.extra.pseudo === "nth-child") {
                    special[special.length - 1] = function (e, p) {
                        if (p.children[Number(data.extra.value) - 1]) {
                            p.insertBefore(e, p.children[Number(data.extra.value) - 1]);
                        } else {
                            p.appendChild(e);
                        }
                    };
                } else if (data.extra.pseudo === "nth-last-of-type") {
                    special[special.length - 1] = function (e, p) {
                        var matches = [],
                            found = false,
                            i;
                        for (i = 0; i < p.children.length; i += 1) {
                            if (p.children[i].nodeName === element.nodeName) {
                                matches.push(p.children[i]);
                            }
                        }
                        if (matches.length >= Number(data.extra.value)) {
                            p.insertBefore(e, matches[(matches.length - Number(data.extra.value)) + 1]);
                        } else {
                            p.appendChild(e);
                        }
                    };
                } else if (data.extra.pseudo === "nth-of-type") {
                    special[special.length - 1] = function (e, p) {
                        var matches = [],
                            found = false,
                            i;
                        for (i = 0; i < p.children.length; i += 1) {
                            if (p.children[i].nodeName === element.nodeName) {
                                matches.push(p.children[i]);
                            }
                        }
                        if (matches.length >= Number(data.extra.value)) {
                            p.insertBefore(e, matches[Number(data.extra.value) - 1]);
                        } else {
                            p.appendChild(e);
                        }
                    };
                } else if (data.extra.pseudo === "only-of-type") {
                    special[special.length - 1] = function (e, p) {
                        var i;
                        for (i = 0; i < p.children.length; i += 1) {
                            if (p.children[i].nodeName === element.nodeName) {
                                while (p.children[i].hasChildNodes()) {
                                    p.children[i].removeChild(p.children[i].firstChild);
                                }
                                p.removeChild(p.children[i]);
                            }
                        }
                        p.appendChild(e);
                    };
                } else if (data.extra.pseudo === "only-child") {
                    special[special.length - 1] = function (e, p) {
                        while (p.hasChildNodes()) {
                            p.removeChild(p.firstChild);
                        }
                        p.appendChild(e);
                    };
                } else if (data.extra.pseudo === "optional") {
                    element.required = false;
                } else if (data.extra.pseudo === "out-of-range") {
                    if (element.getAttribute("max")) {
                        element.setAttribute("value", Math.floor((Math.random() * (Number(element.getAttribute("max")) * 2)) + Number(element.getAttribute("max"))));
                    }
                } else if (data.extra.pseudo === "read-only") {
                    element.readyOnly = true;
                    element.setAttribute("readonly", "");
                    element.contentEditable = false;
                } else if (data.extra.pseudo === "read-write") {
                    element.readOnly = false;
                    element.contentEditable = true;
                } else if (data.extra.pseudo === "required") {
                    element.required = true;
                } else if (data.extra.pseudo === "target") {
                    if (element.getAttribute("id")) {
                        history.pushState({}, document.title, "#" + element.getAttribute("id"));
                    }
                }
            }
            return build(elements, data.extra, loadOrder, load, special, def, done);
        }
    }
    function placebo(selector) {
        var data = parser.parse(selector),
            elements = [],
            def = function (e, p) {
                p.appendChild(e);
            },
            loadOrder,
            targets,
            special,
            built,
            done,
            i;
        if (data.node === "*") {
            targets = document.querySelectorAll("*");
            for (i = 0; i < targets.length; i += 1) {
                elements.push(targets[i].cloneNode(true));
            }
            loadOrder = [0];
            special = [def];
            done = [];
        } else {
            built = build([document.createElement(data.node)], data, [0], 1, [def], def, []);
            elements = built[0];
            loadOrder = built[1];
            special = built[2];
            done = built[3];
        }
        return {
            "done": done,
            "elements": elements,
            "export": function (map) {
                var i;
                for (i = 0; i < this.elements.length; i += 1) {
                    map(this.elements[i]);
                }
                return this;
            },
            "html": function () {
                var wrap = document.createElement('div'),
                    i;
                for (i = 0; i < this.elements.length; i += 1) {
                    wrap.appendChild(this.elements[i]);
                }
                return wrap.innerHTML;
            },
            "loadOrder": loadOrder,
            "on": function (event, callback) {
                var i;
                for (i = 0; i < this.elements.length; i += 1) {
                    this.elements[i].addEventListener(event, callback);
                }
                return this;
            },
            "place": function (parent) {
                var load = [],
                    i,
                    b,
                    c,
                    d;
                if (!parent) {
                    if (document.body) {
                        parent = [document.body];
                    } else {
                        throw "Placebo requires a document with a body!";
                    }
                }
                if (typeof parent === "string") {
                    parent = document.querySelectorAll(parent);
                } else if (parent.placebo) {
                    parent = parent.elements;
                } else if (!parent.length) {
                    parent = [parent];
                }
                function min(item, array) {
                    var a;
                    for (a = 0; a < array.length; a += 1) {
                        if (item > array[a]) {
                            return false;
                        }
                    }
                    return true;
                }
                function sort(loadOrder, elements, special, stack) {
                    var i;
                    if (!loadOrder || loadOrder.length < 1) {
                        return stack;
                    } else {
                        for (i = 0; i < loadOrder.length; i += 1) {
                            if (min(loadOrder[i], loadOrder)) {
                                stack[0].push(elements[i]);
                                stack[1].push(special[i]);
                                loadOrder.splice(i, 1);
                                elements.splice(i, 1);
                                special.splice(i, 1);
                                return sort(loadOrder, elements, special, stack);
                            }
                        }
                    }
                }
                load = sort(this.loadOrder, this.elements, this.special, [[], []]);
                for (b = 0; b < load[0].length; b += 1) {
                    for (d = 0; d < parent.length; d += 1) {
                        load[1][b](load[0][b], parent[d]);
                    }
                }
                for (c = 0; c < this.done.length; c += 1) {
                    this.done[c](parent);
                }
                return this;
            },
            "placebo": true,
            "special": special,
            "style": function (styles) {
                var keys = Object.getOwnPropertyNames(styles),
                    i,
                    a;
                for (i = 0; i < keys.length; i += 1) {
                    for (a = 0; a < this.elements.length; a += 1) {
                        this.elements[a].style[keys[i]] = styles[keys[i]];
                    }
                }
                return this;
            },
            "text": function (text) {
                var i;
                for (i = 0; i < this.elements.length; i += 1) {
                    this.elements[i].innerHTML = text;
                }
                return this;
            }
        };
    }
    if (typeof define === "function" && define.amd) {
        define(function() {
            return placebo;
        });
    } else {
        context.placebo = placebo;
    }
}(this));