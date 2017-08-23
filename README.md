A tool like Alfred on Mac

This is a core library,**NOT** a client with user interface, [Here](https://www.npmjs.com/package/copilot-io) is a GUI program,[Here](https://www.npmjs.com/package/copilot-cli) is a CLI program

**NOTE**

This project is still building, and it was tested only under Ubuntu 16.04

**FEATURE**
+ Windows management
+ System utils
+ Process management
+ Launch applications (by name)
+ Extendible 
+ Alias
+ Pipe
+ Namespace

[TOC]

# How does it work

**Big Picture**

User gives a input to copilot ,copilot gives a list (called `IResult` list) back to user, then user select an item from the list to execute a action related to this item.

If ignore how user interactive with copilot,it's GUI's business,let's use `user>`
and `copilot>` to represent the communication between user and copilot 

For example:
```
user> a google
copilot>
1. google chrome
2. google earth
user> exec 1
copilot> Active google chrome
```
Translate it to humans' language:

```
User: Active a window which has a title looks like google
Copilot: Fine, there are too windows that looks satisfied your requirement.Here there are.
User: OK, active the first.
```

NOTE
>a is an alias that means `active`

**Processor**

A function which takes `option` and `IResult` list to generate a new `IResult` list

**Action**

A mechanism to do something ,such as `copy`, `run cmd` and so on, according to an `IResult` item

**Pipe**

Copilot puts a processor's output to the next processors's input to make processors work together.

For example:
```
buildin.apps.list | buildin.filter.grep -i chrome | buildin.apps.launch
```

processor `buildin.apps.list` generates a list of application installed in system,it is an `IResult` list, and `buildin.filter.grep -i` filter all matched items out, the last one add launch action to items.

```
  buildin.apps.list's output      buildin.filter.grep's output   buildin.apps.launch's output
(buildin.filter.grep's input)    (buildin.apps.launch's input)


  +----------------------+           +-------------------+        +-------------------------+
  | google chrome        |           | google chrome     |        | Active google chrome    |
  +----------------------+---------->+-------------------+------->+-------------------------+
  | firefox              |           | google earth      |        | Active google earth     |
  +----------------------+           +-------------------+        +-------------------------+
  | leafpad              |
  +----------------------+
  | google earth         |
  +----------------------+
``` 

**Alias**

Of cause it is to long to type in order to make `chrome` run. So I added an useful feature to copilot that is `alias`
An alias of run a matched application
```
run: buildin.apps.list | buildin.filter.grep -i __arg__ | buildin.apps.launch
```

# Dependencies

Some processors are dependent on some external command,if those command are missing processors will give hint text on it's output `IResult`

# User Interface

[Here](https://www.npmjs.com/package/copilot-io) is an `javafx` GUI

A CLI user interface is coming.

# Processors

## list
|name|description|
|---|---|
|buildin.apps.list | list all applications|
|buildin.apps.launch | add `run` to app items|
|buildin.dict.iciba | A dictionary 
|buildin.dict.oxford | oxford dictionary
|buildin.file.open | Open a file
|buildin.filter.grep | filter by regexp
|buildin.filter.search| use fuse.js search
|buildin.process.list | list all process
|buildin.process.kill | kill process
|buildin.sys.suspend | Suspend system
|buildin.sys.reboot | Reboot system
|buildin.sys.wifi | toggle WiFi on/off
|buildin.sys.ip | list ip address
|buildin.tldr.list | list cmds ,integrate `tldr` 
|buildin.tldr.show | show short usage info
|buildin.tools.head | output first n items
|buildin.tools.tail | output last n items
|buildin.tools.count | count
|buildin.tools.now | show time
|buildin.tools.toPipe | convert cmd arguments to IResult
|buildin.tools.calc| A math express calculator
|buildin.tools.echo | Cmd to IResult
|buildin.tools.timeout | To do something after specified time out
|buildin.tools.notify | Send a notification
|buildin.tools.copy | change IResult's field to copy 
|buildin.tools.cmd | Excutate cmd by shell
|buildin.win.list | list all windows
|buildin.win.active | active window
|buildin.win.close | close window
|buildin.win.move | move window



## oxford dict
oxford API has a limitation related to query times per month. You'd better to register a new account to get a key to replace to default one.
[Oxford link](https://developer.oxforddictionaries.com)

## External processor

There are two types external processor at the moment,they are `js processor` and `script processor`. The `js processor` are written by javascript and it has the same structure of internal processor and it can use the internal services of cause. The `script processor` are executable scripts which output data in `yaml` format. `Copilot` put arguments to `script's` cmd line argument and put `IResult` items to `script's` stdin stream.

The config section `external.processor` tells copilot where to find external processor.

```yaml
external.processor:
  js:
    path:
      - ~/.config/copilot/processors/js
  script:
    path:
      - ~/.config/copilot/processors/script
```

For example:
For the below dir structure:
```
js
  --qianba
    -- hello.js
    -- demo.js
    -- config.yaml
  -- foo
    -- bar.js
script
  --qianba
    -- hello.sh
    -- config.yaml
```
Copilot will try to load js processors  from `qianba/*.js` and script processors from `qianba/*.hello` and it will also read all those `config.yaml`. The differences is that each `.js` many contains many processors but each `script processor` file just contains only one processor.

**name prefix**
+ `js.[dir].[file].[function]` for js processors (js.qianba.hello.hello)
+ `spt.[dir].[file]` for script processors (spt.qianba.hello)

NOTE
>Only `processors` and `processorsInfo` sections are approved in config.yaml on external processor dirs 


## Todo list

+ Chrome integration
+ Notification framework
+ Improve app launch
+ Improve processor name match