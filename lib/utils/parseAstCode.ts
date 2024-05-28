import mergeWith from "lodash.mergewith";

export function parseAstRawCode(astCode) {
  let obj;
  function customizer(_, srcValue) {
    if (
      srcValue?.type === "AwaitExpression" &&
      srcValue?.argument?.callee?.name === "useStoryblok"
    ) {
      const props = srcValue?.argument?.arguments;
      props.forEach((argument) => {
        argument?.properties?.forEach((property) => {
          if (["apiOptions", "bridgeOptions"].includes(property.key.name)) {
            obj = {
              ...obj,
              [property.key.name]: getAstPropToObj(property?.value?.properties),
            };
          }
        });
      });
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
