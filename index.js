// TODO: Make it work with source maps.

var recast = require('recast');
var estraverse = require('estraverse')

// Util Functions
function flatten(arrays) {
  return Array.prototype.concat.apply([], arrays);
}
// END Util Functions

function tranform(input) {
  var inputAst = recast.parse(input);
  var outputAst = transformAst(inputAst);

  return recast.print(outputAst).code;
}

function transformAst(inputAst) {
  var transformSteps = [
    renameFunctionDeclarations,
    renameTopLevelVariableDeclarations
  ];

  return transformSteps.reduce(function(ast, transformStep) {
    return transformStep(ast);
  }, inputAst);
}

function renameFunctionDeclarations(inputAst) {
  var functionDeclarations = [];

  estraverse.replace(inputAst.program, {
    enter: function(node) {
      if(node.type === 'FunctionDeclaration') {
        functionDeclarations.push(node);
        this.remove();
      } else if(node.type === 'FunctionExpression') {
        this.skip();
      }
    }
  });

  var renamedDeclarations = functionDeclarations.map(tranformFunctionDeclaration);

  inputAst.program.body = renamedDeclarations.concat(inputAst.program.body);

  return inputAst;
}

function tranformFunctionDeclaration(node) {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'Identifier',
          name: 'window',
          typeAnnotation: undefined,
          optional: undefined
        },
        property: {
          type: 'Identifier',
          name: node.id.name,
          typeAnnotation: undefined,
          optional: undefined
        }
      },
      right: {
        type: 'FunctionExpression',
        id: null,
        params: node.params,
        defaults: node.defaults,
        body: node.body, //
        rest: node.rest,
        generator: node.generator,
        expression: node.expression,
        returnType: node.returnType,
        typeParameters: node.typeParameters
      }
    }
  };
}

function renameTopLevelVariableDeclarations(inputAst) {
  inputAst.program.body = flatten(inputAst.program.body.map(function(node) {
    // TODO: Find out behaviour of different kinds of VariableDeclaration, ie let.
    if(node.type !== 'VariableDeclaration' || node.kind !== 'var') {
      return node;
    }

    return node.declarations.map(function(declaration) {
      if(!declaration.init) {
        return;
      }

      return {
        "type": "ExpressionStatement",
        "expression": {
          "type": "AssignmentExpression",
          "operator": "=",
          "left": {
            type: 'MemberExpression',
            computed: false,
            object: {
              type: 'Identifier',
              name: 'window',
              typeAnnotation: undefined,
              optional: undefined
            },
            property: declaration.id
          },
          "right": declaration.init,
        }
      }

    }).filter(function(node) {
      return node !== undefined;
    });
  }));

  return inputAst;
}

module.exports = tranform;
