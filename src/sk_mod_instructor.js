/**
 * Skulpt Module for holding the Instructor API.
 *
 * This module is loaded in by getting the functions' source code from toString.
 * Isn't that crazy?
 *
 * @param {String} name - The name of the module (should always be 'instructor')
 *
 */
var $sk_mod_instructor = function(name) {
    // Main module object that gets returned at the end.
    var mod = {};
    
    /**
     * Skulpt Exception that forces the program to exit, but gracefully.
     * 
     * @param {Array} args - A list of optional arguments to pass to the Exception.
     *                       Usually this will include a message for the user.
     */
    Sk.builtin.GracefulExit = function (args) {
        var o;
        if (!(this instanceof Sk.builtin.GracefulExit)) {
            o = Object.create(Sk.builtin.GracefulExit.prototype);
            o.constructor.apply(o, arguments);
            return o;
        }
        Sk.builtin.Exception.apply(this, arguments);
    };
    Sk.abstr.setUpInheritance("GracefulExit", Sk.builtin.GracefulExit, Sk.builtin.Exception);
    
    /**
     * Give complimentary feedback to the user
     */
    mod.compliment = new Sk.builtin.func(function(message) {
        Sk.builtin.pyCheckArgs("compliment", arguments, 1, 1);
        Sk.builtin.pyCheckType("message", "string", Sk.builtin.checkString(message));
        Sk.executionReports.instructor.compliments.push(Sk.ffi.remapToJS(message));
    });
    /**
     * Mark problem as completed
     */
    mod.complete = new Sk.builtin.func(function() {
        Sk.builtin.pyCheckArgs("complete", arguments, 0, 0);
        Sk.executionReports.instructor.complete = true;
        throw new Sk.builtin.GracefulExit();
    });
    /**
     * Let user know about an issue
     */
    mod.complaint = new Sk.builtin.func(function(message, line) {
        Sk.builtin.pyCheckArgs("compliment", arguments, 1, 2);
        Sk.builtin.pyCheckType("message", "string", Sk.builtin.checkString(message));
        if (line !== undefined) {
            Sk.builtin.pyCheckType("line", "integer", Sk.builtin.checkInt(line));
        }
        Sk.executionReports.instructor.complaint = {
            'name': 'Instructor Feedback',
            'message': Sk.ffi.remapToJs(message),
            'line': line
        }
        throw new Sk.builtin.GracefulExit();
    });
    
    /**
     * Prevent a certain kind of error from percolating.
     */
    mod.suppress = new Sk.builtin.func(function(type, subtype) {
        Sk.builtin.pyCheckArgs("suppress", arguments, 1, 2);
        Sk.builtin.pyCheckType("type", "string", Sk.builtin.checkString(type));
        type = Sk.ffi.remapToJs(type);
        if (subtype !== undefined) {
            Sk.builtin.pyCheckType("subtype", "string", Sk.builtin.checkString(subtype));
            subtype = Sk.ffi.remapToJs(subtype);
            if (Sk.feedbackSuppressions[type] === false) {
                Sk.feedbackSuppressions[type] = {subtype: true};
            } else if (Sk.feedbackSuppressions[type] !== false) {
                Sk.feedbackSuppressions[type][subtype] = true;
            }
        } else {
            Sk.feedbackSuppressions[type] = true;
        }
    });
    
    // get_ast()
    // get_trace()
    // get_types()
    // get_types_raw()
    
    //Enhanced feedback functions and objects starts here
    mod.Ast = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function(self) {
            var parser = Sk.executionReports['parser'];
            if (parser.success) {
                self.ast = parser.ast;
            } else {
                self.ast = null;
            }
            console.log("Parser AST", self.ast);
        });
    }, 'Ast', []);
    
    mod.Types = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function(self) {
            var analyzer = Sk.executionReports['analyzer'];
            if (analyzer.success) {
                self.types = analyzer.variables;
            } else {
                self.types = null;
            }
            console.log("AI Types", self.types);
        });
    }, 'Types', []);
    mod.Behavior = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function(self) {
            var analyzer = Sk.executionReports['analyzer'];
            if (analyzer.success) {
                self.behavior = analyzer.behavior;
            } else {
                self.behavior = null;
            }
            console.log("AI Behavior", self.behavior);
        });
    }, 'Behavior', []);
    
    mod.Trace = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function(self) {
            var student = Sk.executionReports['student'];
            if (student.success) {
                self.trace = student.trace;
            } else {
                self.trace = null;
            }
            console.log("Runtime Trace", self.trace);
        });
    }, 'Trace', []);
    
    mod.Issues = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function(self) {
            var analyzer = Sk.executionReports['analyzer'];
            if (analyzer.success) {
                self.issues = analyzer.issues;
            } else {
                self.issues = null;
            }
            console.log("AI Issues", self.issues);
        });
    }, 'Issues', []);
    
    //---- Everything below this line is old stuff
    
    /**
     * Skulpt Exception that represents a Feedback object, to be rendered to the user
     * when the feedback system finds a problem.
     * 
     * @param {Array} args - A list of optional arguments to pass to the Exception.
     *                       Usually this will include a message for the user.
     */
    Sk.builtin.Feedback = function (args) {
        var o;
        if (!(this instanceof Sk.builtin.Feedback)) {
            o = Object.create(Sk.builtin.Feedback.prototype);
            o.constructor.apply(o, arguments);
            return o;
        }
        Sk.builtin.Exception.apply(this, arguments);
    };
    Sk.abstr.setUpInheritance("Feedback", Sk.builtin.Feedback, Sk.builtin.Exception);
    
    /**
     * Skulpt Exception that represents a Success object, to be thrown when the user
     * completes their program successfully.
     *
     ** @param {Array} args - A list of optional arguments to pass to the Exception.
     *                       Usually this will be empty.
     */
    Sk.builtin.Success = function (args) {
        var o;
        if (!(this instanceof Sk.builtin.Success)) {
            o = Object.create(Sk.builtin.Success.prototype);
            o.constructor.apply(o, arguments);
            return o;
        }
        Sk.builtin.Exception.apply(this, arguments);
    };
    Sk.abstr.setUpInheritance("Success", Sk.builtin.Success, Sk.builtin.Exception);
    
    /**
     * Skulpt Exception that represents a Finished object, to be thrown when the user
     * completes their program successfully, but isn't in a problem with a "solution".
     * This is useful for open-ended canvases where we still want to capture the students'
     * code in Canvas.
     *
     ** @param {Array} args - A list of optional arguments to pass to the Exception.
     *                       Usually this will be empty.
     */
    Sk.builtin.Finished = function (args) {
        var o;
        if (!(this instanceof Sk.builtin.Finished)) {
            o = Object.create(Sk.builtin.Finished.prototype);
            o.constructor.apply(o, arguments);
            return o;
        }
        Sk.builtin.Exception.apply(this, arguments);
    };
    Sk.abstr.setUpInheritance("Finished", Sk.builtin.Finished, Sk.builtin.Exception);
    
    /**
     * A Skulpt function that throws a Feedback exception, allowing us to give feedback
     * to the user through the Feedback panel. This function call is done for aesthetic
     * reasons, so that we are calling a function instead of raising an error. Still,
     * exceptions allow us to break out of the control flow immediately, like a 
     * return, so they are a good mechanism to use under the hood.
     * 
     * @param {String} message - The message to display to the user.
     */
    mod.set_feedback = new Sk.builtin.func(function(message) {
        Sk.builtin.pyCheckArgs("set_feedback", arguments, 1, 1);
        Sk.builtin.pyCheckType("message", "string", Sk.builtin.checkString(message));
        throw new Sk.builtin.Feedback(message.v);
    });
    
    /**
     * A Skulpt function that throws a Success exception. This will terminate the
     * feedback analysis, but reports that the students' code was successful.
     * This function call is done for aesthetic reasons, so that we are calling a
     * function instead of raising an error. Still, exceptions allow us to break
     * out of the control flow immediately, like a return would, so they are a
     * good mechanism to use under the hood.
     */
    mod.set_success = new Sk.builtin.func(function() {
        Sk.builtin.pyCheckArgs("set_success", arguments, 0, 0);
        throw new Sk.builtin.Success();
    });
    
    /**
     * A Skulpt function that throws a Finished exception. This will terminate the
     * feedback analysis, but reports that the students' code was successful.
     * This function call is done for aesthetic reasons, so that we are calling a
     * function instead of raising an error. Still, exceptions allow us to break
     * out of the control flow immediately, like a return would, so they are a
     * good mechanism to use under the hood.
     */
    mod.set_finished = new Sk.builtin.func(function() {
        Sk.builtin.pyCheckArgs("set_finished", arguments, 0, 0);
        throw new Sk.builtin.Finished();
    });
    
    // Memoization of previous parses - some mild redundancy to save time
    // TODO: There's no evidence this is good, and could be a memory hog on big
    // programs. Someone should investigate this. The assumption is that multiple
    // helper functions might be using parses. But shouldn't we trim old parses?
    // Perhaps a timed cache would work better.
    var parses = {};
    
    /**
     * Given source code as a string, return a flat list of all of the AST elements
     * in the parsed source code.
     *
     * TODO: There's redundancy here, since the source code was previously parsed
     * to run the file and to execute it. We should probably be able to do this just
     * once and shave off time.
     *
     * @param {String} source - Python source code.
     * @returns {Array.<Object>}
     */
    function getParseList(source) {
        if (!(source in parses)) {
            var parse = Sk.parse("__main__", source);
            parses[source] = Sk.astFromParse(parse.cst, "__main__", parse.flags);
        }
        var ast = parses[source];
        return (new NodeVisitor()).recursive_walk(ast);
    }

    /**
     * Given source code as a string, return a list of all of the AST elements
     * that are Num (aka numeric literals) but that are not inside List elements.
     *
     * @param {String} source - Python source code.
     * @returns {Array.number} The list of JavaScript numeric literals that were found.
     */
    function getNonListNums(source) {
        if (!(source in parses)) {
            var parse = Sk.parse("__main__", source);
            parses[source] = Sk.astFromParse(parse.cst, "__main__", parse.flags);
        }
        var ast = parses[source];
        var visitor = new NodeVisitor();
        var insideList = false;
        var nums = [];
        visitor.visit_List = function(node) {
            insideList = true;
            this.generic_visit(node);
            insideList = false;
        }
        visitor.visit_Num = function(node) {
            if (!insideList) {
                nums.push(node.n);
            }
            this.generic_visit(node);
        }
        visitor.visit(ast);
        return nums;
    }
    
    /**
     * Given source code as a string, return a list of all of the AST elements
     * that are being printed (using the print function) but are not variables.
     *
     * @param {String} source - Python source code.
     * @returns {Array.<Object>} The list of AST elements that were found.
     */
    function getPrintedNonProperties(source) {
        if (!(source in parses)) {
            var parse = Sk.parse("__main__", source);
            parses[source] = Sk.astFromParse(parse.cst, "__main__", parse.flags);
        }
        var ast = parses[source];
        var visitor = new NodeVisitor();
        var nonVariables = [];
        visitor.visit_Call = function(node) {
            var func = node.func;
            var args = node.args;
            if (func._astname == 'Name' && func.id.v == 'print') {
                for (var i =0; i < args.length; i+= 1) {
                    if (args[i]._astname != "Name") {
                        nonVariables.push(args[i]);
                    }
                }
            }
            this.generic_visit(node);
        }
        visitor.visit(ast);
        return nonVariables;
    }
    
    /**
     * Skulpt function to iterate through the final state of
     * all the variables in the program, and check to see if they have
     * a given value.
     */
    mod.get_value_by_name = new Sk.builtin.func(function(name) {
        Sk.builtin.pyCheckArgs("get_value_by_name", arguments, 1, 1);
        Sk.builtin.pyCheckType("name", "string", Sk.builtin.checkString(name));
        name = name.v;
        var final_values = Sk.builtins._final_values;
        if (name in final_values) {
            return final_values[name];
        } else {
            return Sk.builtin.none.none$;
        }
    });
    mod.get_value_by_type = new Sk.builtin.func(function(type) {
        Sk.builtin.pyCheckArgs("get_value_by_type", arguments, 1, 1);
        
        var final_values = Sk.builtins._final_values;
        var result = [];
        for (var property in final_values) {
            if (final_values[property].tp$name == type.tp$name) {
                result.push(final_values[property]);
            }
        }
        return Sk.builtin.list(result);
    });
    
    mod.parse_json = new Sk.builtin.func(function(blob) {
        Sk.builtin.pyCheckArgs("parse_json", arguments, 1, 1);
        Sk.builtin.pyCheckType("blob", "string", Sk.builtin.checkString(blob));
        blob = blob.v;
        return Sk.ffi.remapToPy(JSON.parse(blob));
    });
    mod.get_property = new Sk.builtin.func(function(name) {
        Sk.builtin.pyCheckArgs("get_property", arguments, 1, 1);
        Sk.builtin.pyCheckType("name", "string", Sk.builtin.checkString(name));
        name = name.v;
        var trace = Sk.builtins._trace;
        if (trace.length <= 0) {
            return Sk.builtin.none.none$;
        }
        var properties = trace[trace.length-1]["properties"];
        for (var i = 0, len = properties.length; i < len; i += 1) {
            if (properties[i]['name'] == name) {
                return Sk.ffi.remapToPy(properties[i])
            }
        }
        return Sk.builtin.none.none$;
    });
    
    mod.calls_function = new Sk.builtin.func(function(source, name) {
        Sk.builtin.pyCheckArgs("calls_function", arguments, 2, 2);
        Sk.builtin.pyCheckType("source", "string", Sk.builtin.checkString(source));
        Sk.builtin.pyCheckType("name", "string", Sk.builtin.checkString(name));
        
        source = source.v;
        name = name.v;
        
        var ast_list = getParseList(source);
        
        var count = 0;
        for (var i = 0, len = ast_list.length; i < len; i = i+1) {
            if (ast_list[i]._astname == 'Call') {
                if (ast_list[i].func._astname == 'Attribute') {
                    count += Sk.ffi.remapToJs(ast_list[i].func.attr) == name | 0;
                } else if (ast_list[i].func._astname == 'Name') {
                    count += Sk.ffi.remapToJs(ast_list[i].func.id) == name | 0;
                }   
            }
        }
        
        return Sk.ffi.remapToPy(count > 0);
    });
    
    mod.count_components = new Sk.builtin.func(function(source, component) {
        Sk.builtin.pyCheckArgs("count_components", arguments, 2, 2);
        Sk.builtin.pyCheckType("source", "string", Sk.builtin.checkString(source));
        Sk.builtin.pyCheckType("component", "string", Sk.builtin.checkString(component));
        
        source = source.v;
        component = component.v;
        
        var ast_list = getParseList(source);
        
        var count = 0;
        for (var i = 0, len = ast_list.length; i < len; i = i+1) {
            if (ast_list[i]._astname == component) {
                count = count+1;
            }
        }
        
        return Sk.ffi.remapToPy(count);
    });
    
    mod.no_nonlist_nums = new Sk.builtin.func(function(source) {
        Sk.builtin.pyCheckArgs("no_nonlist_nums", arguments, 1, 1);
        Sk.builtin.pyCheckType("source", "string", Sk.builtin.checkString(source));
        
        source = source.v;
        
        var num_list = getNonListNums(source);
        
        var count = 0;
        for (var i = 0, len = num_list.length; i < len; i = i+1) {
            if (num_list[i].v != 0 && num_list[i].v != 1) {
                return Sk.ffi.remapToPy(true);
            }
        }
        return Sk.ffi.remapToPy(false);
    });

    mod.only_printing_properties = new Sk.builtin.func(function(source) {
        Sk.builtin.pyCheckArgs("only_printing_properties", arguments, 1, 1);
        Sk.builtin.pyCheckType("source", "string", Sk.builtin.checkString(source));
        
        source = source.v;
        
        var non_var_list = getPrintedNonProperties(source);
        return Sk.ffi.remapToPy(non_var_list.length == 0);
    });
    
    //Enhanced feedback functions and objects starts here
    //variable used for easy reidentification of nodes so we don't have to recreate every node type
    var flatTree = [];
    //variable used for accumulating interrupting feedback AS A LIST OF PYTHON OBJECTS
    var accInterruptFeedback = [];
    //variable used for accumulating complementary feedback AS A LIST OF PYTHON OBJECTS
    var accCompFeedback = [];
    /**
     * Given source code as a string, generate a flatTree and store it in the local variable.
     * This function is meant to be used to avoid extra coding by recreating every AST node type
     *
     * @param {String} source - Python source code.
     */
    function generateFlatTree(source){
        if (!(source in parses)) {
            var parse = Sk.parse("__main__", source);
            parses[source] = Sk.astFromParse(parse.cst, "__main__", parse.flags);
        }
        //Tree's already been built, don't do anything else
        if(flatTree.length > 0){
            return;
        }
        var ast = parses[source];
        var visitor = new NodeVisitor();
        visitor.visit = function(node){
            flatTree.push(node);
            /** Visit a node. **/
            var method_name = 'visit_' + node._astname;
            console.log(flatTree.length - 1 + ": " + node._astname)
            if (method_name in this) {
                return this[method_name](node);
            } else {
                return this.generic_visit(node);
            }
        }
        visitor.visit(ast);
    }

    function isSkBuiltin(obj){
        return (obj instanceof Sk.builtin.dict) ||
            (obj instanceof Sk.builtin.list) ||
            (obj instanceof Sk.builtin.tuple) ||
            (obj instanceof Sk.builtin.bool) ||
            (obj instanceof Sk.builtin.int_) ||
            (obj instanceof Sk.builtin.float_) ||
            (obj instanceof Sk.builtin.lng);
    }
    /**
     * Should theoretically belong in Sk.ffi, but I put it here instead to not mess up the skulpt files
     * like the normal Sk.ffi.remapToPy, it doesn't work for functions or more complex objects, but it handles
     * cases where the types in obj ore a mix of python SIMPLE objects and SIMPLE normal javascript objects
     * @param {object} obj - the object to be converted
     * @return {Sk.builtin.???} - returns the corresponding python object, dropping all functions and things it can't convert
    **/
    function mixedRemapToPy(obj){
        var k;
        var kvs;
        var i;
        var arr;
        if(isSkBuiltin(obj)){
            return obj;
        }else if (Object.prototype.toString.call(obj) === "[object Array]") {
            arr = [];
            for (i = 0; i < obj.length; ++i) {
                var subval = obj[i];
                if(!isSkBuiltin(subval)){
                    arr.push(Sk.ffi.mixedRemapToPy(subval));
                }else{
                    arr.push(subval)
                }
            }
            return new Sk.builtin.list(arr);
        } else if (obj === null) {
            return Sk.builtin.none.none$;
        } else if (typeof obj === "object") {
            if(!isSkBuiltin(obj)){
                kvs = [];
                for (k in obj) {
                    if(!isSkBuiltin(k)){
                        kvs.push(Sk.ffi.mixedRemapToPy(k));
                    }else{
                        kvs.push(k);
                    }
                    kvs.push(Sk.ffi.mixedRemapToPy(obj[k]));
                }
                return new Sk.builtin.dict(kvs);
            }else{
                return obj;
            }
        } else if (typeof obj === "string") {
            return new Sk.builtin.str(obj);
        } else if (typeof obj === "number") {
            return Sk.builtin.assk$(obj);
        } else if (typeof obj === "boolean") {
            return new Sk.builtin.bool(obj);
        }
    }

    /**
     * Given source code as a string, generates the mock AST nodes the instructor will be using
     * note that this function doesn't return anything.
     * @param {String} source - Python source code.
     * @param {mod.AstNode} - returns the python version of the root node
    **/
    mod.parse_program = new Sk.builtin.func(function(source) {
        Sk.builtin.pyCheckArgs("parse_program", arguments, 1, 1);
        Sk.builtin.pyCheckType("source", "string", Sk.builtin.checkString(source));
        source = source.v;
        generateFlatTree(source);
        return Sk.misceval.callsimOrSuspend(mod.AstNode, 0);
    });

    /**@TODO: make this function affect the UI
     * Given a feedback string, records the corrective feedback string for later printing
     * @param {string} feedback - the piece of feedback to save
    **/
    mod.add_interrupt_feedback = new Sk.builtin.func(function(feedback) {
        Sk.builtin.pyCheckArgs("add_iterupt_feedback", arguments, 1, 1);
        Sk.builtin.pyCheckType("feedback", "string", Sk.builtin.checkString(feedback));
        accInterruptFeedback.push(feedback);
    });
    /**@TODO: make this function affect the UI
     * Given a feedback string, records the complementary feedback string for later printing
     * @param {string} feedback - the piece of feedback to save
    **/
    mod.add_comp_feedback = new Sk.builtin.func(function(feedback) {
        Sk.builtin.pyCheckArgs("add_comp_feedback", arguments, 1, 1);
        Sk.builtin.pyCheckType("feedback", "string", Sk.builtin.checkString(feedback));
        accCompFeedback.push(feedback);
    });

    /**
     * This resolves all of the feedback and posts it to the appropriate places
     * @TODO: actually implement this functionality
    **/
    mod.post_feedback = new Sk.builtin.func(function() {
        var allFeedback = accInterruptFeedback.concat(accCompFeedback);
        completePythonAll = Sk.builtin.list(allFeedback);
        jsPureFeedback = Sk.ffi.remapToJs(completePythonAll);
        console.log("" + jsPureFeedback);
    });

    /**
     * Python representation of the AST nodes w/o recreating the entire thing. This class assumes that parse_program
     * is called first
     * @property {number} self.id - the javascript id number of this object
     * @property {string} self.type - the javascript string representing the type of the node (_astname)
     * @property {Sk.abstr.(s/g)attr} id - the python version of self.id
     * @property {Sk.abstr.(s/g)attr} type - the python version of self.type
    **/
    mod.AstNode = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function(self, id) {
            self.id = Sk.ffi.remapToJs(id);//note that id is passed from PYTHON as a default type already
            self.type = flatTree[self.id]._astname;
            Sk.abstr.sattr(self, 'type', Sk.ffi.remapToPy(self.type), true);
            var thisNode = flatTree[self.id];
        });
        
        /**
         * This function dynamically looks to see if the ast node has a given property and does
         * remapping where it can
         * @param {obj} self - the javascript object representing the python AST node (which is also a python object)
         * @param {string} key - the property the user is trying to look up
        **/
        $loc.__getattr__ = new Sk.builtin.func(function(self, key) {
            console.log("getattr");
            var actualAstNode = flatTree[self.id];
            key = Sk.ffi.remapToJs(key);
            if(key in actualAstNode){
                var field = actualAstNode[key];
                //@TODO: check for flag to see if chain assignments are allowed, otherwise return first item
                if(actualAstNode._astname == "Assign" && key == "targets"){//this means its an assignment node
                    var childId = flatTree.indexOf(field[0]);//get the relevant node
                    return Sk.misceval.callsimOrSuspend(mod.AstNode, childId);
                }else if(field.constructor === Array){
                    console.log("array handling");
                    var astNodeCount = 0
                    var fieldArray = [];
                    //this will likely always be a mixed array
                    for(var i = 0; i < field.length; i++){
                        var subfield = field[i];
                        //if AST node, use callism and push new object
                        if(subfield instanceof Object && "_astname" in subfield){//an AST node)
                            var childId = flatTree.indexOf(subfield);//get the relevant node
                            console.log(childId);
                            fieldArray.push(Sk.misceval.callsimOrSuspend(mod.AstNode, childId));
                        }else{//else smart remap
                            console.log(subfield);
                            var tranSubfield = mixedRemapToPy(subfield);
                            if(tranSubfield != undefined){
                                console.log(tranSubfield);
                                fieldArray.push(tranSubfield);
                            }
                        }
                    }
                    return new Sk.builtin.list(fieldArray);
                }else if('v' in field){//probably already a python object
                    return field;
                }else if(field instanceof Object && "_astname" in field){//an AST node
                    var childId = flatTree.indexOf(field);//get the relevant node
                    return Sk.misceval.callsimOrSuspend(mod.AstNode, childId);
                }
            }
            return Sk.ffi.remapToPy(null);
        });

        /**
         * Given the python Name ast node (variable) and self (which is automatically filled), checks
         * the AST on the javascript side to see if the node has the specified variable using the name
         * @TODO: change this so it can handle any data type as opposed to just numbers and ast nodes
         * @param {???} self - the javascript reference of this object, which is self in python.
         * @param {mod.AstNode} pyAstNode - the python object representing the variable node to look for
        **/
        $loc.has = new Sk.builtin.func(function(self, pyAstNode) {
            var rawVariableName = null;
            var rawNum = null;
            var nodeId = self.id;
            var thisNode = flatTree[nodeId];
            //got a number instead of an AST node
            if(Sk.builtin.checkNumber(pyAstNode)){
                rawNum = Sk.ffi.remapToJs(pyAstNode);
            }else{//assume it's an AST node
                //@TODO: should handle exceptions/do type checking
                var otherId = Sk.ffi.remapToJs(pyAstNode.id);
                var otherNode = flatTree[otherId];
                if(otherNode._astname != "Name"){
                    return Sk.ffi.remapToPy(false);
                }
                rawVariableName = Sk.ffi.remapToJs(otherNode.id);
            }

            var hasVar = false;
            var visitor = new NodeVisitor();
            if(rawVariableName != null){
                visitor.visit_Name = function(node){
                    var otherRawName = Sk.ffi.remapToJs(node.id);
                    if(rawVariableName == otherRawName){
                        hasVar = true;
                        return;
                    }
                    return this.generic_visit(node);
                }
            }

            if(rawNum != null){
                visitor.visit_Num = function(node){
                    var otherNum = Sk.ffi.remapToJs(node.n);
                    if(rawNum == otherNum){
                        hasVar = true;
                        return;
                    }
                    return this.generic_visit(node);
                }
            }

            visitor.visit(flatTree[nodeId]);
            return Sk.ffi.remapToPy(hasVar);
        });

        /**
         * Given a type of ast node as a string, returns all in the ast that are nodes of the specified "type"
         * valid options include BinOp, For, Call, If, Compare, Assign, Expr, note that these ARE case sensitive
         * @param {???} self - the javascript reference of this object, which is self in python.
         * @param {Sk.builtin.str} type - the python string representing the "type" of node to look for
        **/
        $loc.find_all = new Sk.builtin.func(function(self, type) {
            var items = [];
            var visitor = new NodeVisitor();
            var currentId = self.id - 1;
            var funcName = 'visit_' + Sk.ffi.remapToJs(type);
            visitor.visit = function(node) {
                currentId += 1;
                /** Visit a node. **/
                var method_name = 'visit_' + node._astname;
                if (method_name in this) {
                    return this[method_name](node);
                } else {
                    return this.generic_visit(node);
                }
            }
            visitor[funcName] = function(node){
                var skulptNode = Sk.misceval.callsimOrSuspend(mod.AstNode, currentId);
                items.push(skulptNode);
                return this.generic_visit(node);
            }
            var nodeId = self.id;
            visitor.visit(flatTree[nodeId]);
            //Don't use Sk.ffi because the objects in the array are already python objects
            return new Sk.builtin.list(items);
        });
    });
    return mod;
}