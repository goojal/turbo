(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{77:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return c})),a.d(t,"metadata",(function(){return i})),a.d(t,"toc",(function(){return o})),a.d(t,"default",(function(){return l}));var n=a(3),r=a(7),s=(a(0),a(88)),c={title:"Hardhat Tasks",slug:"/tasks"},i={unversionedId:"hardhat-tasks",id:"hardhat-tasks",isDocsHomePage:!1,title:"Hardhat Tasks",description:"Hardhat Tasks",source:"@site/docs/hardhat-tasks.md",slug:"/tasks",permalink:"/tasks",editUrl:"https://github.com/AugurProject/turbo/edit/dev/augur.sh/docs/hardhat-tasks.md",version:"current",sidebar:"docs",previous:{title:"Getting Started",permalink:"/"},next:{title:"contract-api",permalink:"/contract-api"}},o=[{value:"Utilities",id:"utilities",children:[]},{value:"Selecting a network",id:"selecting-a-network",children:[]},{value:"Specifying a private key",id:"specifying-a-private-key",children:[]},{value:"Canned Markets",id:"canned-markets",children:[]},{value:"The Rundown",id:"the-rundown",children:[]},{value:"Fund link",id:"fund-link",children:[]},{value:"Request score",id:"request-score",children:[]}],d={toc:o};function l(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(s.b)("wrapper",Object(n.a)({},d,a,{components:t,mdxType:"MDXLayout"}),Object(s.b)("h1",{id:"hardhat-tasks"},"Hardhat Tasks"),Object(s.b)("p",null,"Augur Turbo takes advantage of Hardhat to handle smart contract development,\nand comes pre-packaged with a variety of useful tasks for interacting with the\nAugur contracts."),Object(s.b)("p",null,"The source for these tasks are all available in the ",Object(s.b)("a",{parentName:"p",href:"https://github.com/AugurProject/turbo/tree/dev/packages/smart/tasks"},"packages/smart/tasks\n")," directory."),Object(s.b)("h2",{id:"utilities"},"Utilities"),Object(s.b)("p",null,"There are a variety of utility tasks available, for instance:"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-bash"},"# Print the list of accounts\nyarn hardhat accounts\n\n# Print an account's balance\nyarn hardhat --account [account address]\n")),Object(s.b)("p",null,"To get a complete list run:"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-bash"},"yarn hardhat\n")),Object(s.b)("h2",{id:"selecting-a-network"},"Selecting a network"),Object(s.b)("p",null,"Default network settings are registered to allow you to select a network. These\nare defined in\n",Object(s.b)("a",{parentName:"p",href:"https://github.com/AugurProject/turbo/tree/dev/packages/smart/hardhat.config.ts"},"packages/smart/hardhat.config.ts"),".\nThe ",Object(s.b)("inlineCode",{parentName:"p"},"--network")," argument can be used with hardhat tasks to direct the task to\nconnect to a specific network."),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-bash"},"yarn hardhat [task] --network [kovan|mumbai|arbitrum|...]\n")),Object(s.b)("h2",{id:"specifying-a-private-key"},"Specifying a private key"),Object(s.b)("p",null,"To deploy to anywhere but hardhat or localhost, you must provide a private key using an environment variable like so:"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-bash"},"PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 yarn hardhat --network kovan deploy\n")),Object(s.b)("p",null,"Or you may export the environment variable into your shell's ENV list:"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-bash"},"export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80\nyarn hardhat --network kovan deploy\n")),Object(s.b)("h2",{id:"canned-markets"},"Canned Markets"),Object(s.b)("p",null,"A variety of test markets can be created by using the ",Object(s.b)("inlineCode",{parentName:"p"},"cannedMarkets"),"\ntask. This is useful for both local and testnet deploys, allowing you to\nstart with a list of markets that is consistent."),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-bash"},"yarn hardhat cannedMarkets\n")),Object(s.b)("h2",{id:"the-rundown"},"The Rundown"),Object(s.b)("p",null,"We are adding tasks to make it easy to fetch data from TheRunDown. In order to\nuse these you will need a rundown api key from rapidapi."),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre"},"yarn hardhat fetch-rundown-event --event [eventId] --key [rundownApiKey]\n")),Object(s.b)("h2",{id:"fund-link"},"Fund link"),Object(s.b)("p",null,"This task funds an address with 1 LINK. Call this task with a private key and network. Make sure that private key account has LINK. "),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre"},"yarn hardhat fundLink --contract [contractAddress]\n")),Object(s.b)("h2",{id:"request-score"},"Request score"),Object(s.b)("p",null,"This request the score for a match. Call this task with a private key and network. Fund TheRundownChainlink contract with LINK first. You can use the fundLink task for this. "),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre"},"yarn hardhat requestScore\n")))}l.isMDXComponent=!0}}]);