start = siblings / node

sibling =  " "? ("," / "+" / "~") " "? node:nodeRequired {return node}
siblings = first:nodeRequired " "? rest:sibling* {return [first].concat(rest)}

nmstart = [a-zA-Z\_]
nmchar = [a-zA-Z0-9\_\-]
ident = hyphen:"-"? first:nmstart rest:nmchar* {return hyphen||"" + first + rest.join("")}
name = name:nmchar+ {return name.join("")}
element = name:(ident / "*") {return name}
text = text:[^\)\]]+ " "? {return text.join("")}

node = node:element? extra:extra* {return {node:node||"div",extra:extra}}
nodeRequired = node:element extra:extra* {return {node:node,extra:extra}}
extra = class / id / children / inside / attributeIs / attribute / pseudoSpecial / pseudo

class = "." name:ident {return {"name":"class","value":name}}
id = "#" name:name {return {"name":"id","value":name}}
inside = " " child:(siblings / nodeRequired) {return {"name":"child","value":child}}
children = " "?  ">" " "? child:(siblings / nodeRequired) {return {"name":"child","value":child}}
attribute = "[" name:text "]" {return {"name":"attribute","value":[name, ""]}}
attributeIs = "[" name:ident ("~" / "|" / "^" / "$" / "*")? "=" value:text? "]" {return {"name":"attribute","value":[name, value||""]}}
pseudo = ":" ":"? name:ident {return {"name":"pseudo","value":[name,null]}}
pseudoSpecial = ":" ":"? name:ident "(" value:text? ")" {return {"name":"pseudo","value":[name, value]}}
