### Vite has 2 repos for glsl bundling to detect glsl in JS

- vite-plugin-glsl : Well maintained and is popular
- vite-plugin-glslify : supposed to the standard way

## vite.config.js

```javascript
import glsl from 'vite-plugin-glsl'

// ...

export default {
  // ...
  plugins: [glsl()],
}
```

# Terms Learnt

- 4th term in vec4 is w( or a if you alias to alpha from rbg) and is used for perspective division for the remaining x,y,z. so for far objects w is larger and dividing by w will make the object smaller and vice versa
- after 2-3 weeks, revisit this. set a reminder for this
- as per claude, look up 'homogeneous coordinates' much later once comfortable with writing custom shaders. also very linear algebra heavy
- swizzle where you take terms from a bigger vector and use them in a smaller vector

```glsl
vec3 foo = vec3(1.0, 2.0, 3.0);
vec2 bar = foo.xy;  //here vec2 will be (1.0, 2.0)

foo.xz = vec2(9.0,7.0); //here foo is (9.0, 2.0, 7.0)
```
- the formula, we read from vec4 to projectionMatrix since matrix multiplication is read from right to left( Simons misssed out on this)

```glsl
 gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
```
- do not use Date.now() for uniforms as we cannot send huge values to the uniforms

- always pass objects to uniforms

- sampler2D is the type for textures, not vec3, vec4 or anything
