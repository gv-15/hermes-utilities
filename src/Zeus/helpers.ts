export function assertIsDefined<Type>(
  val: Type,
  message?: string
): asserts val is NonNullable<Type> {
  if (!val) {
    throw new Error(message ?? 'Variable not defined');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDelta<Type extends Record<string, any>, Type2 extends Type>(
  newValue: Type,
  oldValue: Type2
): Partial<Type> {
  const result: Partial<Type> = {};

  for (const key in newValue) {
    // type of field
    switch (Object.prototype.toString.call(newValue[key])) {
      case '[object Object]':
        // if field === object
        if (JSON.stringify(newValue[key]) !== JSON.stringify(oldValue[key])) {
          result[key] = newValue[key];
        }

        break;

      case '[object Array]':
        // if 2 arrays have different length -> add whole array to result
        if (newValue[key].length != oldValue[key].length) {
          result[key] = newValue[key];
        }

        // if array of primitives
        if (Object.prototype.toString.call(newValue[key][0]) !== '[object Object]') {
          // if new array has at least one new entry -> add whole array to result
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          newValue[key].forEach((el: keyof Type) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if (!oldValue[key].includes(el)) {
              result[key] = newValue[key];
            }
          });

          // if array has at least one changed entry -> add whole array to result
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          newValue[key].forEach((el: keyof Type) => {
            if (newValue[key][el] !== oldValue[key][el]) {
              result[key] = newValue[key];
            }
          });
        }

        // if array of object
        if (Object.prototype.toString.call(newValue[key][0]) === '[object Object]') {
          // check if any differences between 2 arrays
          const isObjEqual = Object.keys(newValue[key]).every(
            el => JSON.stringify(newValue[key][el]) === JSON.stringify(oldValue[key][el])
          );
          // if any differences -> add whole array to result
          if (!isObjEqual) {
            result[key] = newValue[key];
          }
        }

        break;

      // if field type is primitive
      default:
        if (newValue[key] != oldValue[key]) {
          result[key] = newValue[key];
        }
    }
  }

  return result;
}

export function inputIsNotNullOrUndefined<T>(input: null | undefined | T): input is T {
  return input !== null && input !== undefined;
}
