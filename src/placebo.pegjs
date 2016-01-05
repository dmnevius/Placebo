start = e:element? extra:extra? {return {"node":e.join("")||"div","extra":extra}}
valid = [^\.\#\,\>\+\~\[\]\|\=\^\$\*\:\)\(\ ]
element = node:(valid / "*")* {return node}
extra = attributes / pseudo / pseudoSpecial / pseudoSpecialO / multi / child / ichild / after / contains / brackets
attributes = class / id
pseudo = ":" ":"? p:("active" / "after" / "before" / "checked" / "disabled" / "empty" / "enabled" / "first-child" / "first-letter" / "first-line" / "first-of-type" / "focus" / "hover" / "in-range" / "invalid" / "last-child" / "last-of-type" / "link" / "only-of-type" / "only-child" / "optional" / "out-of-range" / "read-only" / "read-write" / "required" / "root" / "selection" / "target" / "valid" / "visited") extra:extra? {var a={};a.pseudo=p;a.extra=extra||{};return a}
pseudoSpecial = ":" p:("lang" / "nth-child" / "nth-last-child" / "nth-last-of-type" / "nth-of-type") "(" v:(valid / [0-9])* ")" extra:extra? {var a={};a.pseudo=p;a.value=v.join("");a.extra=extra||{};return a}
pseudoSpecialO = ":" p:("not") "(" e:element? v:extra? ")" extra:extra? {var a={};a.pseudo=p;a.value={};a.value.node=e.join("")||"div";a.value.extra=v;a.extra=extra||{};return a}
brackets = "[" cond:(equal / hasword / has / startsh / starts / end / attr) "]" extra:extra? {cond.extra=extra||{};return cond}
class = "." val:valid* extra:extra? {return {"class":val.join(""),"extra":extra||{}}}
id = "#" val:valid* extra:extra? {return {"id":val.join(""),"extra":extra||{}}}
multi = " "? "," " "? e:element extra:extra? {return {"node":e.join(""),"extra":extra||{}}}
contains = " " e:element extra:extra? {return {"contains":e.join(""),"extra":extra||{}}}
child = " "? ">" " "? e:element extra:extra? {return {"child":e.join(""),"extra":extra||{}}}
ichild = " "? "+" " "? e:element extra:extra? {return {"immediate_child":e.join(""),"extra":extra||{}}}
after = " "? "~" " "? e:element extra:extra? {return {"after":e.join(""),"extra":extra||{}}}
attr = attr:valid* {return {"attr":attr.join("")}}
equal = attr:valid* " "? "=" " "? val:valid* {return {"attr_is":attr.join(""),"value":val.join("")}}
hasword = attr:valid* " "? "~=" " "? val:valid* {return {"attr_has_word":attr.join(""),"value":val.join("")}}
startsh = attr:valid* " "? "|=" " "? val:valid* {return {"attr_starts_hyphen":attr.join(""),"value":val.join("")}}
starts = attr:valid* " "? "^=" " "? val:valid* {return {"attr_starts":attr.join(""),"value":val.join("")}}
end = attr:valid* " "? "$=" " "? val:valid* {return {"attr_ends":attr.join(""),"value":val.join("")}}
has = attr:valid* " "? "*=" " "? val:valid* {return {"attr_has":attr.join(""),"value":val.join("")}}