export function generateQueryFieldOperator(operator: string) {
  switch (operator) {
    case '>=': {
      return '$gte';
    }
    case '>': {
      return '$gt';
    }
    case '<=': {
      return '$lte';
    }
    case '<': {
      return '$lt';
    }
    case '==': {
      return '$eq';
    }
    default: {
      throw new Error('Unknown operator used');
    }
  }
}
