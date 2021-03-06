// TODO: Make it work with source maps.

var recast = require('recast');
var estraverse = require('estraverse')

// Util Functions
function flatten(arrays) {
  return Array.prototype.concat.apply([], arrays);
}
// END Util Functions

function transform(input) {
  var inputAst = recast.parse(input);
  var outputAst = transformAst(inputAst);

  return recast.print(outputAst).code;
}

function transformAst(inputAst) {
  var transformers = [
    transformFunctionDeclarations,
    transformVariableDeclarations
  ];

  return transformers.reduce(function(ast, transformer) {
    return transformer(ast);
  }, inputAst);
}

function transformFunctionDeclarations(inputAst) {
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

  var transformedDeclarations = functionDeclarations.map(transformFunctionDeclaration);

  inputAst.program.body = transformedDeclarations.concat(inputAst.program.body);

  return inputAst;
}

function transformFunctionDeclaration(node) {
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
          name: 'window'
        },
        property: {
          type: 'Identifier',
          name: node.id.name
        }
      },
      right: {
        type: 'FunctionExpression',
        id: null,
        params: node.params,
        defaults: node.defaults,
        body: node.body,
        rest: node.rest,
        generator: node.generator,
        expression: node.expression,
        returnType: node.returnType,
        typeParameters: node.typeParameters
      }
    }
  };
}

function transformVariableDeclarations(inputAst) {
  var variableDeclarations = [];

  estraverse.replace(inputAst.program, {
    enter: function(node) {
      if(node.type === 'VariableDeclaration' && node.kind === 'var') {
        variableDeclarations.push(node);
        return transformVariableDeclaration(node);
      } else if(node.type === 'FunctionExpression') {
        this.skip();
      }
    }
  });

  var declarationInitialisations = variableDeclarations.map(createVariableDeclarationInitialisation);

  inputAst.program.body = declarationInitialisations.concat(inputAst.program.body);

  return inputAst;
}

function createVariableDeclarationInitialisation(declaration) {
  return {
    "type": "ExpressionStatement",
    "expression": {
      type: 'SequenceExpression',
      expressions: declaration.declarations.map(function(declaration) {
        return {
          "type": "AssignmentExpression",
          "operator": "=",
          "left": {
            type: 'MemberExpression',
            computed: false,
            object: {
              type: 'Identifier',
              name: 'window'
            },
            property: declaration.id
          },
          "right": {
            "type": "Identifier",
            "name": "undefined"
          }
        }
      })
    }
  }
}

function transformVariableDeclaration(node) {
  var declarationsWithInit = node.declarations.filter(function(declaration) {
    return declaration.init !== null;
  });

  if(declarationsWithInit.length === 0) {
    return null;
  }

  return {
    "type": "ExpressionStatement",
    "expression": {
      type: 'SequenceExpression',
      expressions: declarationsWithInit.map(function(declaration) {
        return {
          "type": "AssignmentExpression",
          "operator": "=",
          "left": {
            type: 'MemberExpression',
            computed: false,
            object: {
              type: 'Identifier',
              name: 'window'
            },
            property: declaration.id
          },
          "right": declaration.init,
        }
      })
    }
  }
}

module.exports = transform;
