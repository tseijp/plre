export const basicMaterial = (key = '') => /* CPP */ `
vec3 ${key}(vec3 pos, vec3 nor) {
  vec3 light = normalize(vec3(1.0));
  return vec3(dot(nor, light)) * 0.5 + 0.5;
}
`

export const normalMaterial = (key = '') => /* CPP */ `
vec3 ${key}(vec3 pos, vec3 nor) {
  return nor;
}
`
