import mergeWith from "lodash.mergewith";

export function parseAstRawCode(astCode) {
  let obj;
  function customizer(_, srcValue) {
    if (
      srcValue?.type === "AwaitExpression" &&
      srcValue?.argument?.callee?.name === "useStoryblok"
    ) {
      const props = srcValue?.argument?.arguments;
      if (props[1]?.type === "ObjectExpression") {
        obj = {
          ...obj,
          apiOptions: getAstPropToObj(props[1]?.properties),
        };
      }
      if (props[2]?.type === "ObjectExpression") {
        obj = {
          ...obj,
          bridgeOptions: getAstPropToObj(props[2]?.properties),
        };
      }
    }
  }

  mergeWith({}, astCode, customizer);
  return obj;
}

function getAstPropToObj(properties) {
  return properties.reduce((options, { key, value }) => {
    const { type } = value;
    options[key.name] =
      type === "Literal"
        ? value.value
        : type === "ArrayExpression"
          ? value.elements.map((v) => v.value)
          : value.value;
    return options;
  }, {});
}
