// @flow
import type { ASTNode } from 'graphql';
import { GraphQLError } from 'graphql/error'

export default function createParseHandler(
  typeName: string,
  validateValue: (value: string) => boolean,
  parseValue: (value: string) => Date
) {
  return (value: mixed, ast: ?ASTNode): Date => {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new GraphQLError(
        `${typeName} cannot represent non string type ${JSON.stringify(value)}`,
        ast ? [ast] : undefined
      )
    }

    if (!validateValue(value)) {
      throw new GraphQLError(
        `${typeName} cannot represent an invalid time-string ${JSON.stringify(value)}`,
        ast ? [ast] : undefined
      )
    }
    
    return parseValue(value)
  }
}
