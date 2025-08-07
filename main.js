const questionBank = {
  easy: {
    level: "easy",
    questions: [
  {
    question: "What tag is used for a table row?",
    options: ["<tr>", "<td>", "<th>", "<row>"],
    answer: "<tr>"
  },
  {
    question: "Which property changes background color?",
    options: ["background-color", "bg-color", "color-bg", "background"],
    answer: "background-color"
  },
  {
    question: "Which keyword is used to declare a constant in JavaScript?",
    options: ["const", "var", "let", "static"],
    answer: "const"
  },
  {
    question: "Which method converts JSON to object?",
    options: ["JSON.parse()", "JSON.stringify()", "parseJSON()", "toJSON()"],
    answer: "JSON.parse()"
  },
  {
    question: "What is the output of typeof null?",
    options: ["object", "null", "undefined", "boolean"],
    answer: "object"
  },
  {
    question: "How do you center a div horizontally with margin?",
    options: ["margin: 0 auto;", "text-align: center;", "align: center;", "padding: auto 0;"],
    answer: "margin: 0 auto;"
  },
  {
    question: "Which loop runs at least once?",
    options: ["do...while", "while", "for", "repeat"],
    answer: "do...while"
  },
  {
    question: "Which property is used to change text color in CSS?",
    options: ["color", "text-color", "font-color", "style"],
    answer: "color"
  },
  {
    question: "Which attribute specifies the image source?",
    options: ["src", "href", "link", "path"],
    answer: "src"
  },
  {
    question: "What does NaN mean?",
    options: ["Not a Number", "Null and None", "New and Next", "Negative and Null"],
    answer: "Not a Number"
  },
  {
    question: "Which tag is used to create a line break?",
    options: ["<br>", "<break>", "<lb>", "<line>"],
    answer: "<br>"
  },
  {
    question: "Which property makes an element flexbox?",
    options: ["display: flex", "flex: display", "flexbox", "layout: flex"],
    answer: "display: flex"
  },
  {
    question: "Which element is used for unordered lists?",
    options: ["<ul>", "<ol>", "<li>", "<list>"],
    answer: "<ul>"
  },
  {
    question: "Which HTML tag is used to display an image?",
    options: ["<img>", "<src>", "<image>", "<pic>"],
    answer: "<img>"
  },
  {
    question: "What value hides an element in CSS?",
    options: ["display: none", "visibility: hide", "opacity: 0", "hidden: true"],
    answer: "display: none"
  },
  {
    question: "Which tag is used to create a hyperlink in HTML?",
    options: ["<a>", "<link>", "<href>", "<url>"],
    answer: "<a>"
  },
  {
    question: "Which operator is used to compare value and type?",
    options: ["===", "==", "=", "!="],
    answer: "==="
  },
  {
    question: "Which symbol is used for comments in JS?",
    options: ["//", "#", "<!-- -->", "**"],
    answer: "//"
  },
  {
    question: "What is the output of '2' + 2 in JS?",
    options: ["22", "4", "NaN", "Error"],
    answer: "22"
  },
  {
    question: "What does DOM stand for?",
    options: ["Document Object Model", "Data Object Manager", "Dynamic Output Model", "Display Object Map"],
    answer: "Document Object Model"
  },
  {
    question: "Which HTML tag is used to make text bold?",
    options: ["<b>", "<strong>", "<bold>", "<em>"],
    answer: "<b>"
  },
  {
    question: "What is the default position in CSS?",
    options: ["static", "relative", "absolute", "fixed"],
    answer: "static"
  },
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyperlink Text Markdown Language"],
    answer: "Hyper Text Markup Language"
  },
  {
    question: "Which CSS unit is relative to the root element?",
    options: ["rem", "em", "px", "%"],
    answer: "rem"
  },
  {
    question: "What does CSS stand for?",
    options: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Syntax", "Colorful Style Sheets"],
    answer: "Cascading Style Sheets"
  },
  {
    question: "Which method adds an element to the end of an array?",
    options: ["push()", "add()", "append()", "insert()"],
    answer: "push()"
  },
  {
    question: "How do you select an element with class 'box'?",
    options: [".box", "#box", "box", "*box"],
    answer: ".box"
  },
  {
    question: "How do you make text italic in CSS?",
    options: ["font-style: italic", "text-style: italic", "font: italic", "style: italic"],
    answer: "font-style: italic"
  },
  {
    question: "Which property controls text size?",
    options: ["font-size", "text-size", "size", "font"],
    answer: "font-size"
  },
  {
    question: "What does the <title> tag do?",
    options: ["Sets the page title", "Creates a heading", "Adds a tooltip", "Displays an alert"],
    answer: "Sets the page title"
  }

    ]
  },

  normal: {
  level: "normal",
  questions: [
  {
    question: "Which method is used to render React to DOM?",
    options: ["ReactDOM.render", "React.mount", "render()", "ReactDOM.mount"],
    answer: "ReactDOM.render"
  },
  {
    question: "What is a smart contract?",
    options: ["Self-executing code", "Wallet key", "API endpoint", "Crypto miner"],
    answer: "Self-executing code"
  },
  {
    question: "What is hashing?",
    options: ["Converting data to fixed output", "Encrypting passwords", "Mining blocks", "Compressing files"],
    answer: "Converting data to fixed output"
  },
  {
    question: "What is the output of typeof undefined?",
    options: ["undefined", "null", "object", "string"],
    answer: "undefined"
  },
  {
    question: "How do you pass data to a child?",
    options: ["Props", "State", "Ref", "Hooks"],
    answer: "Props"
  },
  {
    question: "Which wallet is non-custodial?",
    options: ["MetaMask", "Coinbase", "Binance", "Revolut"],
    answer: "MetaMask"
  },
  {
    question: "What is proof of stake?",
    options: ["Validators stake coins", "Miners solve puzzles", "Contracts validate", "Wallet sync"],
    answer: "Validators stake coins"
  },
  {
    question: "What is gas in Ethereum?",
    options: ["Transaction fee", "Token name", "Reward system", "Block size"],
    answer: "Transaction fee"
  },
  {
    question: "Which method converts a value to a string?",
    options: ["toString()", "toValue()", "stringify()", "parse()"],
    answer: "toString()"
  },
  {
    question: "What is the purpose of setTimeout?",
    options: ["Delay execution", "Loop execution", "Clear memory", "Block code"],
    answer: "Delay execution"
  },
  {
    question: "What is useRef used for?",
    options: ["Access DOM", "Manage state", "Update props", "Call API"],
    answer: "Access DOM"
  },
  {
    question: "Which function creates wallet address?",
    options: ["Hashing public key", "Private key", "Signature", "Block hash"],
    answer: "Hashing public key"
  },
  {
    question: "What does 'this' refer to in a method?",
    options: ["Object calling it", "Global object", "Function itself", "Parent object"],
    answer: "Object calling it"
  },
  {
    question: "What is the global object in browsers?",
    options: ["window", "global", "document", "app"],
    answer: "window"
  },
  {
    question: "What is the result of 3 === '3'?",
    options: ["false", "true", "NaN", "Error"],
    answer: "false"
  },
  {
    question: "What is a functional component?",
    options: ["JS function returning JSX", "HTML element", "CSS block", "JSX wrapper"],
    answer: "JS function returning JSX"
  },
  {
    question: "What is a key prop used for?",
    options: ["Unique identification", "Add style", "Attach listeners", "Set state"],
    answer: "Unique identification"
  },
  {
    question: "What is a component?",
    options: ["Reusable piece of UI", "HTML tag", "JS function", "State hook"],
    answer: "Reusable piece of UI"
  },
  {
    question: "What is the max supply of Bitcoin?",
    options: ["21 million", "100 million", "Infinite", "1 billion"],
    answer: "21 million"
  },
  {
    question: "What is a promise in JS?",
    options: ["An object for async operations", "A function", "A loop", "A variable"],
    answer: "An object for async operations"
  },
  {
    question: "Which keyword is used to define a class in JS?",
    options: ["class", "function", "object", "struct"],
    answer: "class"
  },
  {
    question: "What is a blockchain?",
    options: ["Distributed ledger", "Encrypted database", "Web server", "Decentralized app"],
    answer: "Distributed ledger"
  },
  {
    question: "What is JSX?",
    options: ["JavaScript XML", "Java Syntax Extension", "JSON Syntax", "None of these"],
    answer: "JavaScript XML"
  },
  {
    question: "What is closure in JavaScript?",
    options: ["Function + lexical scope", "Class method", "Object", "Event handler"],
    answer: "Function + lexical scope"
  },
  {
    question: "What hook is used for side effects?",
    options: ["useEffect", "useState", "useCallback", "useRef"],
    answer: "useEffect"
  },
  {
    question: "Which one is a layer 2 solution?",
    options: ["Polygon", "Bitcoin", "Solana", "Ethereum"],
    answer: "Polygon"
  },
  {
    question: "What is state in React?",
    options: ["Component data", "App layout", "Component props", "CSS styling"],
    answer: "Component data"
  },
  {
    question: "What does useState return in React?",
    options: ["Array with value and setter", "Function", "Boolean", "Component"],
    answer: "Array with value and setter"
  },
  {
    question: "Which method removes the last element in an array?",
    options: ["pop()", "shift()", "splice()", "remove()"],
    answer: "pop()"
  },
  {
    question: "What is a node?",
    options: ["Participant in network", "Coin", "Wallet", "Key"],
    answer: "Participant in network"
  }
]

},

hard:{
    level: "hard",
    questions: [
  {
    question: "How do you make a function accessible only to the contract owner?",
    options: ["onlyOwner", "private", "view", "pure"],
    answer: "onlyOwner"
  },
  {
    question: "What is a hash function?",
    options: ["Converts input to fixed output", "Encrypts data", "Compresses file", "Signs transaction"],
    answer: "Converts input to fixed output"
  },
  {
    question: "What is a constructor?",
    options: ["Init function called once", "Fallback handler", "Delete function", "Gas estimator"],
    answer: "Init function called once"
  },
  {
    question: "Which function modifier prevents reentrancy?",
    options: ["nonReentrant", "onlyOwner", "payable", "view"],
    answer: "nonReentrant"
  },
  {
    question: "Which global variable gives transaction sender?",
    options: ["msg.sender", "tx.origin", "this.sender", "block.sender"],
    answer: "msg.sender"
  },
  {
    question: "What is elliptic curve cryptography used for?",
    options: ["Key generation", "Data compression", "Gas saving", "Hashing"],
    answer: "Key generation"
  },
  {
    question: "What is reentrancy attack?",
    options: ["Repeated entry into a function", "Gas leak", "Hash collision", "Orphan block"],
    answer: "Repeated entry into a function"
  },
  {
    question: "What does 'require' do in Solidity?",
    options: ["Validates input", "Loops data", "Defines contract", "Saves gas"],
    answer: "Validates input"
  },
  {
    question: "Which of the following is asymmetric encryption?",
    options: ["RSA", "AES", "SHA-3", "MD5"],
    answer: "RSA"
  },
  {
    question: "What is the difference between view and pure functions?",
    options: ["Pure doesn't read state, view does", "Pure can write state", "View returns bool", "No difference"],
    answer: "Pure doesn't read state, view does"
  },
  {
    question: "What is an event in Solidity?",
    options: ["Log on blockchain", "UI update", "Variable trigger", "Private call"],
    answer: "Log on blockchain"
  },
  {
    question: "Which versioning symbol means compatible updates?",
    options: ["^", "~", ">", "="],
    answer: "^"
  },
  {
    question: "Which data type is used for currency in Solidity?",
    options: ["uint", "money", "int", "ether"],
    answer: "uint"
  },
  {
    question: "Which tool is used to test smart contracts?",
    options: ["Hardhat", "Docker", "Ethers.js", "Postman"],
    answer: "Hardhat"
  },
  {
    question: "What is a payable function?",
    options: ["Accepts Ether", "Returns gas", "Signs data", "Calls event"],
    answer: "Accepts Ether"
  },
  {
    question: "Which property does cryptographic hash not have?",
    options: ["Reversibility", "Deterministic", "Collision resistance", "Fixed length"],
    answer: "Reversibility"
  },
  {
    question: "What is the function of 'memory' keyword?",
    options: ["Temporary storage", "Permanent storage", "Stack allocation", "Gas-free"],
    answer: "Temporary storage"
  },
  {
    question: "Which function generates public key from private key?",
    options: ["Elliptic curve multiplication", "Hashing", "Signing", "Compression"],
    answer: "Elliptic curve multiplication"
  },
  {
    question: "What happens when a transaction runs out of gas?",
    options: ["It fails", "It pauses", "It retries", "It completes partially"],
    answer: "It fails"
  },
  {
    question: "What is a nonce?",
    options: ["Number used once", "Private key", "Token", "Smart contract"],
    answer: "Number used once"
  },
  {
    question: "What is immutability in smart contracts?",
    options: ["Cannot be changed after deploy", "Can update code", "Readonly variable", "No constructor"],
    answer: "Cannot be changed after deploy"
  },
  {
    question: "What is a fallback function in Solidity?",
    options: ["Default function for unknown calls", "Error handler", "View function", "Payable constructor"],
    answer: "Default function for unknown calls"
  },
  {
    question: "What is a digital signature?",
    options: ["Proof of authenticity", "Encryption method", "Smart contract", "Wallet password"],
    answer: "Proof of authenticity"
  },
  {
    question: "Which algorithm is used by Bitcoin?",
    options: ["SHA-256", "Ethash", "Blake2", "MD5"],
    answer: "SHA-256"
  },
  {
    question: "What is the purpose of salt in hashing?",
    options: ["Prevent rainbow attacks", "Encrypt data", "Compress hash", "Split hash"],
    answer: "Prevent rainbow attacks"
  },
  {
    question: "Which keyword is used to send Ether in Solidity?",
    options: ["transfer", "pay", "sendEther", "call"],
    answer: "transfer"
  },
  {
    question: "Which one is a key derivation function?",
    options: ["PBKDF2", "SHA-1", "HMAC", "RSA"],
    answer: "PBKDF2"
  },
  {
    question: "What is a modifier?",
    options: ["Pre-check for functions", "Object method", "Loop iterator", "State hook"],
    answer: "Pre-check for functions"
  },
  {
    question: "What does ABI stand for?",
    options: ["Application Binary Interface", "Automatic Block Identifier", "Advanced Binary Index", "Anonymous Block Interaction"],
    answer: "Application Binary Interface"
  },
  {
    question: "What is the visibility of a function that can be accessed externally and internally?",
    options: ["public", "external", "private", "internal"],
    answer: "public"
  }
]

}
};

export default questionBank;
