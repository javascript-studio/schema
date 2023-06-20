# Changes

## 6.0.1

- 🐛 [`78038d0`](https://github.com/javascript-studio/schema/commit/78038d02e9c18a0e244fcd846cb2527a220dd0cf)
  Fix invalid property not verified in combination with opt

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2023-06-20._

## 6.0.0

- 💥 [`af0dc6f`](https://github.com/javascript-studio/schema/commit/af0dc6f666b19c3f8bb4f8ae816128a8be39de8a)
  Make API strict and add types
- 💥 [`7356f14`](https://github.com/javascript-studio/schema/commit/7356f1443e3b7d1bb5a53e46972b54b1051b06f6)
  Drop node 12 and 14, add node 18
- 📚 [`9e8e76d`](https://github.com/javascript-studio/schema/commit/9e8e76d46c3ba5a5438e7c52a00b3cfeb519a643)
  Adjust documentation
- 🛡 [`e00d6e0`](https://github.com/javascript-studio/schema/commit/e00d6e0f248869345ac1d4e65013dab04e3d23c5)
  npm audit
- ✨ [`b53a986`](https://github.com/javascript-studio/schema/commit/b53a9863743261997c85d13a26e225bfd303f633)
  Inline additional property type definitions
- ✨ [`237d012`](https://github.com/javascript-studio/schema/commit/237d012b511597690d0c2623f60a6da361b193ea)
  Setup typescript and jsdoc
- ✨ [`1a41ad8`](https://github.com/javascript-studio/schema/commit/1a41ad820b146613a7366b5e70f3d44cd87487e3)
  Remove superfluous parameter
- ✨ [`dfffe83`](https://github.com/javascript-studio/schema/commit/dfffe839f1f60b8f1a63cc61edcaf46c8c82c07b)
  Move schema implementation into index.js

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2023-04-17._

## 5.4.2

- 🐛 [`5b44823`](https://github.com/javascript-studio/schema/commit/5b44823b032bbe987c620fb4914c8596de375e49)
  Support loading this module with import
- 🛡 [`ea28219`](https://github.com/javascript-studio/schema/commit/ea282192231a85befcd9fa07535ad9602ccc44c9)
  Bump minimatch from 3.0.4 to 3.1.2 (dependabot[bot])

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2023-01-19._

## 5.4.1

- 🐛 [`3a0e73f`](https://github.com/javascript-studio/schema/commit/3a0e73f540de918d275e0fd3aacadd50b392110a)
  Fix integer map key validator

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2022-09-19._

## 5.4.0

- 🍏 [`5f425de`](https://github.com/javascript-studio/schema/commit/5f425de3537d2b2b32e30709cb407b91ad8d4b97)
  Expose literal type and values
- 🍏 [`b97b0bc`](https://github.com/javascript-studio/schema/commit/b97b0bce842970dc2ed2be2dc4f28fd259fe4124)
  Expose map type with processed `keys` and `values`
- 🍏 [`e6db2ef`](https://github.com/javascript-studio/schema/commit/e6db2efcbdf1fdcfd62c006c4c04a9626196ea4d)
  Expose type of schema spec and the corresponding validators
- 🍏 [`c844775`](https://github.com/javascript-studio/schema/commit/c844775dcb7829affa6c52d2a8f3e85d0499d4b9)
  Expose type of optional spec and the corresponding validators
- 🍏 [`8b0bf97`](https://github.com/javascript-studio/schema/commit/8b0bf97d89f2db8bffc4fc9dc46bb0c0b399df8b)
  Expose object property validators as `properties`
- 🍏 [`fa6151c`](https://github.com/javascript-studio/schema/commit/fa6151cb4aef0ac7eb8a9bebb60c564ac394d0ba)
  Expose array item validator as `items`
- ✨ [`a92d0c0`](https://github.com/javascript-studio/schema/commit/a92d0c05b95c6701dd5764b04a1af9ecd126849d)
  Add `copyTypeAndProperties` util

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2022-07-21._

## 5.3.0

- 🍏 [`9ed6a2b`](https://github.com/javascript-studio/schema/commit/9ed6a2b7c87931cfcac7a76ed2bb461cea90938f)
  Add support for integer validators as map keys
- 🍏 [`7aa83f0`](https://github.com/javascript-studio/schema/commit/7aa83f06053321d78cc4deed278a659eec32a7ec)
  Expose type string on validators
- 🛡 [`bbb300c`](https://github.com/javascript-studio/schema/commit/bbb300cf00692d1c2b4aeae54b650fe2fbd9476d)
  npm audit
- ✨ [`895f570`](https://github.com/javascript-studio/schema/commit/895f570d4f47dd1f8f02de2189df556baf57e66a)
  Upgrade husky and lint-staged
- ✨ [`ae06585`](https://github.com/javascript-studio/schema/commit/ae06585238f9ba15d64a63816effd84b7a1daeed)
  Update mocha and mochify
- ✨ [`f04f6b7`](https://github.com/javascript-studio/schema/commit/f04f6b71d6b056dd261a6103a7cdd3db379fa9a8)
  Update prettier
- ✨ [`c1b3c6f`](https://github.com/javascript-studio/schema/commit/c1b3c6f28737339aa33cc77ee1c0a0682ff24ca2)
  Update eslint

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2022-07-21._

## 5.2.2

- 🐛 [`f2fa1d2`](https://github.com/javascript-studio/schema/commit/f2fa1d237d58ee2b1c6b0ce21bbe582097d831ee)
  Unwrap array function arguments

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2022-07-14._

## 5.2.1

- ✨ [`f60ece4`](https://github.com/javascript-studio/schema/commit/f60ece437952cc08d7f07ac1449e0d983d7d5736)
  Improve validation error message for regexp

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2022-05-03._

## 5.2.0

- 🍏 [`984b480`](https://github.com/javascript-studio/schema/commit/984b480450539c077dff55153716e5e19372f932)
  Expose regexp validator creation on `string.regexp`
- 📚 [`27b4ea0`](https://github.com/javascript-studio/schema/commit/27b4ea0445e33a3a404d0990da551a7d94fe8ade)
  Document string.regexp and string.length validators
- ✨ [`3e99dd2`](https://github.com/javascript-studio/schema/commit/3e99dd2d6fe332ec9c37946ec1a42a35933228a7)
  Reinstall dependencies
- ✨ [`992b23e`](https://github.com/javascript-studio/schema/commit/992b23e284c4ef8c29a349406e2cfabbe378dc01)
  Update husky
- ✨ [`3a4bd0b`](https://github.com/javascript-studio/schema/commit/3a4bd0b764e5d2e78d655304135c690ae42b7089)
  Upgrade mocha and mochify
- ✨ [`470535a`](https://github.com/javascript-studio/schema/commit/470535aba84d9a6c57d6aac031a8a908020ca6a3)
  Update prettier
- ✨ [`dd61131`](https://github.com/javascript-studio/schema/commit/dd61131245c8cc1df9b16c5c8c65bd8e6c064dbf)
  Upgrade lint-staged
- ✨ [`cfd198c`](https://github.com/javascript-studio/schema/commit/cfd198c51032f1ec0b32eb79f05f0117ddf8c210)
  Update eslint and eslint-config
- 🛡 [`c136bcc`](https://github.com/javascript-studio/schema/commit/c136bcc53bf6be5597351069fac3f035aa6362ee)
  npm audit
- 🛡 [`f3f05f3`](https://github.com/javascript-studio/schema/commit/f3f05f36f164b128bc026669f8db79074ca88c45)
  Bump cached-path-relative from 1.0.2 to 1.1.0 (dependabot[bot])

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2022-05-02._

## 5.1.12

- 🐛 [`7c317e2`](https://github.com/javascript-studio/schema/commit/7c317e26e0247bdd6b3c01c863c012cbf0eb228d)
  Fix usage of invalid `WeakMap` keys
- ✨ [`e115084`](https://github.com/javascript-studio/schema/commit/e115084e29841f7694cf71d882946d5c3de98357)
  Use existing verifyer in read / write of `one` and `all`

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-11-01._

## 5.1.11

- 🐛 [`25c318d`](https://github.com/javascript-studio/schema/commit/25c318dcb66832c4bdac4d83637812565ab4b8b9)
  Fix `read` and `write` for `one` with custom validators
- 🐛 [`084954e`](https://github.com/javascript-studio/schema/commit/084954ea354db4f1a7f489e1321a0dc8f65f9516)
  Fix `read` and `write` for `all` with custom validators

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-11-01._

## 5.1.10

- 🐛 [`5548669`](https://github.com/javascript-studio/schema/commit/55486690f05a765e780e3df4f787076417393c71)
  Add `read` and `write` for `all`
- 🐛 [`5d34329`](https://github.com/javascript-studio/schema/commit/5d3432928fe2c5beef51aa7f30d7fc83de0684e9)
  Add `read` and `write` for `one`

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-11-01._

## 5.1.9

- 🐛 [`33c96e7`](https://github.com/javascript-studio/schema/commit/33c96e7d58e3598de3aaecc479cebe1aa6093edb)
  Preserve cached instances

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-09-15._

## 5.1.8

- 🐛 [`6b80e8b`](https://github.com/javascript-studio/schema/commit/6b80e8b156fa54d3738b3be6e8e65803b5d47f89)
  Clear cache entries on modify

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-09-15._

## 5.1.7

- 🐛 [`a4b9255`](https://github.com/javascript-studio/schema/commit/a4b9255aba31500b93ee99b908290c05f1fddbfb)
  Do not throw when accessing `nodeType` for Sinon compatibility

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-08-02._

## 5.1.6

- 🐛 [`1b6ab1d`](https://github.com/javascript-studio/schema/commit/1b6ab1db66a20c8ea4a5129b939ef396029fc665)
  Fix paths in events for objects in arrays

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-07-30._

## 5.1.5

- 🐛 [`afd7239`](https://github.com/javascript-studio/schema/commit/afd72393aa6a435c3f8beb57363936cec97530de)
  Fix custom `error_code` with objects
- 🐛 [`42fe9f4`](https://github.com/javascript-studio/schema/commit/42fe9f4cdff4039d9e0c4b62579acbce67e84dc8)
  Fix npm files
- ✨ [`5dad2c0`](https://github.com/javascript-studio/schema/commit/5dad2c01a768b2c6970a7b10c4753c2737420994)
  Update referee-sinon
- ✨ [`0ddedd3`](https://github.com/javascript-studio/schema/commit/0ddedd3b12f1dbe1679e7bc0b2b03c37604ba96c)
  Rename lint-staged config file

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-07-29._

## 5.1.4

- 🐛 [`de5569a`](https://github.com/javascript-studio/schema/commit/de5569a8e1fabdf208e5da166836c1d21062eb30)
  Add read and write to opt
- ✨ [`ae6c618`](https://github.com/javascript-studio/schema/commit/ae6c6189a1f88f2582d3abb78d75d80893b82bca)
  Move `copyPropertyDescriptor` helper into util
- ✨ [`283466e`](https://github.com/javascript-studio/schema/commit/283466e94b8ace52804ece08190c1fd389c81853)
  Add nyc test coverage
- ✨ [`d2d3650`](https://github.com/javascript-studio/schema/commit/d2d36505d54c635170f9ec26261074f789b43c2a)
  Add mocha config
- ✨ [`ecedaab`](https://github.com/javascript-studio/schema/commit/ecedaabcea0b03d43e004f89236f92e29f7e6a1d)
  Upgrade husky
- ✨ [`24aace9`](https://github.com/javascript-studio/schema/commit/24aace9b0f19c4f24981961775aad63f4019d67c)
  Update mochify
- ✨ [`ac77b50`](https://github.com/javascript-studio/schema/commit/ac77b50806ab36ecdcab34f35ead2166bfb3e5b8)
  Update referee-sinon

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-07-20._

## 5.1.3

- 🐛 [`dc2d8ad`](https://github.com/javascript-studio/schema/commit/dc2d8add945ee0c6c1632a41703eca034239e627)
  Unwrap nested objects and arrays
- ✨ [`4ad8f90`](https://github.com/javascript-studio/schema/commit/4ad8f90ef88c620894a023986748a5a27c0b562d)
  Use `Object.entries`

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-07-02._

## 5.1.2

- 🐛 [`73b9fe7`](https://github.com/javascript-studio/schema/commit/73b9fe763b7d8e54d07384e614f1029d65a76b5f)
  Pass schema options to readers and writers

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-06-15._

## 5.1.1

- 🐛 [`b48163b`](https://github.com/javascript-studio/schema/commit/b48163be22bbaf228eae52d483ac2447bf012920)
  Fix use custom error code for invalid properties

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-06-14._

## 5.1.0

- 🍏 [`ef635af`](https://github.com/javascript-studio/schema/commit/ef635af586b61c825ec13f6a2e2e66e6fe48011a)
  Add `string.length` validators

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-06-14._

## 5.0.0

- 💥 [`50396a4`](https://github.com/javascript-studio/schema/commit/50396a4f0e240cfd6e74d304b045fe860e17d4b6)
  Change error code to `E_SCHEMA` and allow override
- 🍏 [`6a15185`](https://github.com/javascript-studio/schema/commit/6a15185f6864472222e31e6d9e528ec3cfe65b4a)
  Change `toString` for `opt`
- 🍏 [`5672937`](https://github.com/javascript-studio/schema/commit/56729378913803de2fd33d2f4cf274c31e85e292)
  Change `toString` for `map`

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-06-14._

## 4.0.1

- 🐛 [`4d6885d`](https://github.com/javascript-studio/schema/commit/4d6885dfe3e029bf6e8ef902a8de92dc3ae58066)
  Improve message for undefined property values
- 🐛 [`105a67d`](https://github.com/javascript-studio/schema/commit/105a67d9bd6bacffacbcd8aaec27af1430bea734)
  Improve literal stringification

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-06-10._

## 4.0.0

- 💥 [`7267301`](https://github.com/javascript-studio/schema/commit/726730199813622e5dcf366c510964521363e4cb)
  Remove magic string validators
- 💥 [`665a603`](https://github.com/javascript-studio/schema/commit/665a603b16acff64cd255c7947a723e69a44f206)
  Remove `raw` from API and document `toJSON`
- 💥 [`b9212b1`](https://github.com/javascript-studio/schema/commit/b9212b1aeb32136ffbabf9fbe4d781e1b4d61c24)
  Replace `SPEC_NAME` with `toString`
- 💥 [`734fdb4`](https://github.com/javascript-studio/schema/commit/734fdb45a7f3ac4a0ca74ebdab51869236738672)
  Rename `"custom value"` to `"<custom validator>"`
- 🍏 [`27186a3`](https://github.com/javascript-studio/schema/commit/27186a39f2271ebc74a5631167fb0291a8d2af6e)
  Add `integer.{min,max,range}`
- 🍏 [`799e5bf`](https://github.com/javascript-studio/schema/commit/799e5bfa2e0a3a524b6bcee3a620159883d91ba7)
  Add `number.{min,max,range}` validators
- 🍏 [`b283151`](https://github.com/javascript-studio/schema/commit/b2831512688c170cc7fc1a40412b1a6b54e73373)
  Implement `all` validator
- 🍏 [`4e819a6`](https://github.com/javascript-studio/schema/commit/4e819a696fc490179ce21b45186d75887a675c61)
  Support object and array with any values
- 🍏 [`3ce3ce6`](https://github.com/javascript-studio/schema/commit/3ce3ce6894ead5aff8456afc4f959504a1fa56f5)
  Expose `validator`
- 🍏 [`5fd506e`](https://github.com/javascript-studio/schema/commit/5fd506eeae36fb4d35646cb6754eb9291f21c273)
  Add `defined`, `boolean`, `number`, `integer` and `string`
- 🍏 [`3527107`](https://github.com/javascript-studio/schema/commit/3527107b3501f56c0ed9168054f384536b68422a)
  Create a validator for a function spec
- 🐛 [`65e0994`](https://github.com/javascript-studio/schema/commit/65e0994682fb397a8285bce2e0d7422656d33e08)
  Fix repository url
- 🐛 [`31944df`](https://github.com/javascript-studio/schema/commit/31944df37062ef85170a42882db38e51b55bb5fd)
  Fix map events
- 📚 [`f148a2c`](https://github.com/javascript-studio/schema/commit/f148a2c9e2df429c963f9210f1d72b4d95fe730e)
  Document number and integer min, max and range
- 📚 [`d39cfbe`](https://github.com/javascript-studio/schema/commit/d39cfbedab61ec8dab0f065387ce1ce08facb470)
  Fix documentation for opt
- 📚 [`d698109`](https://github.com/javascript-studio/schema/commit/d6981096149e66568ff35dd56bbd89144c8ffbfd)
  State that number and integer must be finite
- 📚 [`15a882e`](https://github.com/javascript-studio/schema/commit/15a882e6e82d89501d6c4adc67e3739ba8198328)
  Fix typo
- 📚 [`e07612e`](https://github.com/javascript-studio/schema/commit/e07612e55db549ae5ef5156a2a4fbac9ce3f9814)
  Adjust keywords
- 📚 [`3561c71`](https://github.com/javascript-studio/schema/commit/3561c71510a4116e49ed321f25a57f97c42c2e02)
  Polish readme
- 📚 [`6ea85ae`](https://github.com/javascript-studio/schema/commit/6ea85aee66f7a376f397255b059123e4c2c28723)
  Improve API documentation
- 📚 [`3ef106f`](https://github.com/javascript-studio/schema/commit/3ef106f394380a97d334b1036d43bc4dc0be68e3)
  Adjust documentation
- ✨ [`2e0fd31`](https://github.com/javascript-studio/schema/commit/2e0fd312af7a13a5b68b0cfe8753f7e0727ee821)
  Move `{min,max,range}` into generic numeric factory
- ✨ [`a8808f3`](https://github.com/javascript-studio/schema/commit/a8808f32e12663de95ea2e1426244828c0cc463c)
  Adjust npm files
- ✨ [`41222e1`](https://github.com/javascript-studio/schema/commit/41222e19c1d6ca1fbd4e4129d7488671efdd3e5a)
  Move `createItemSetter` to own function
- ✨ [`826cc79`](https://github.com/javascript-studio/schema/commit/826cc7973bfc197244d5998b89309e75e3b3af0d)
  Move `createPropertySetter` to own function
- ✨ [`d00c7b3`](https://github.com/javascript-studio/schema/commit/d00c7b390c1f0fa9310fdabd8610b451363f46fe)
  Use for-of
- ✨ [`40a95ec`](https://github.com/javascript-studio/schema/commit/40a95ec9a330ebca12f129e4fc727bea39d2de6d)
  Rename `spec-test` to `registry`
- ✨ [`6a54af7`](https://github.com/javascript-studio/schema/commit/6a54af7d1bbb8c0528590f91c753daf347d7d18a)
  Rename `registerSpecType` to `register`
- ✨ [`842bf46`](https://github.com/javascript-studio/schema/commit/842bf46238f0405aed9ad6de45dd9c3802afaff7)
  Rename `specTest` to `lookup`
- ✨ [`e4ab723`](https://github.com/javascript-studio/schema/commit/e4ab7237cc72c0cd5b2b964952b573f261d80476)
  Inline regexp tester
- ✨ [`546cc4b`](https://github.com/javascript-studio/schema/commit/546cc4b6ac3d9a5220dc4df9129c8c41fbfe04c4)
  Move `specTests` into object
- ✨ [`934dd39`](https://github.com/javascript-studio/schema/commit/934dd399f1f7b22f526251a9e4da474e003e13aa)
  Simplify schema
- ✨ [`0e34f12`](https://github.com/javascript-studio/schema/commit/0e34f12e1ac1100b1643600cf9ffda0d6f47773c)
  Move `fail`, `stringify` and `typeOf` into `util`
- ✨ [`3a89171`](https://github.com/javascript-studio/schema/commit/3a89171bafcfa0e2c25831c0c16e9bf2d431f772)
  Move `specName` into `util`
- ✨ [`68f5033`](https://github.com/javascript-studio/schema/commit/68f5033fde59dc3909c23f1a70186d97199563bb)
  Move `SPEC_NAME` into `constants`
- ✨ [`81e357c`](https://github.com/javascript-studio/schema/commit/81e357c72b7b0dcdf09aff2e4924ab7adbf9f26f)
  Move `lazy` into `util`
- ✨ [`7efa56c`](https://github.com/javascript-studio/schema/commit/7efa56c64081e490c79fbee0c1576e5ebf772093)
  Move `assertType` into `util`
- ✨ [`ce103df`](https://github.com/javascript-studio/schema/commit/ce103df2645f8187f87bc3528231313f657d1581)
  Move `raw` into `util`
- ✨ [`668d8c7`](https://github.com/javascript-studio/schema/commit/668d8c714dd31a1ad7d36bcd9bfc334b3b6eb902)
  Rename `path` to `util`
- ✨ [`02f3394`](https://github.com/javascript-studio/schema/commit/02f3394b7705ee030c31feddb8a9ce3d51edb9f9)
  Improve `specName`
- ✨ [`c327e4f`](https://github.com/javascript-studio/schema/commit/c327e4f9783b78db97e14aef403a5d97dccf2589)
  Prefer parameter default value
- ✨ [`61e8017`](https://github.com/javascript-studio/schema/commit/61e801789263196bca39e09b5b59f7e11815c373)
  Refactor `spec-test`
- ✨ [`5c0a5d6`](https://github.com/javascript-studio/schema/commit/5c0a5d6c4a766a02d760ce054cbd1b0bf30e8749)
  Define file endings for prettier
- ✨ [`d3c3eb4`](https://github.com/javascript-studio/schema/commit/d3c3eb4546235a51ca2d76284775c12ef9acb25a)
  Replace obsolete type validators with `assertType`
- ✨ [`206b018`](https://github.com/javascript-studio/schema/commit/206b018ecb928e88fa3664115c630354a6ec2fb0)
  Introduce `assertType` helper
- ✨ [`fec83b2`](https://github.com/javascript-studio/schema/commit/fec83b25192324861a5af3e589af00b226c57281)
  Add validator helper
- ✨ [`a8d96a4`](https://github.com/javascript-studio/schema/commit/a8d96a4015db62d2520bb669f18b5911e7c06977)
  Fix watch script
- ✨ [`4c09142`](https://github.com/javascript-studio/schema/commit/4c09142858def8471492c78f4a0ec12c776dea74)
  Remove "studio-" prefix from project name
- ✨ [`2588d26`](https://github.com/javascript-studio/schema/commit/2588d26e41f636d70484fa6b0f34b19baddf61e0)
  Use pre installed chrome in GitHub action
- ✨ [`24173f0`](https://github.com/javascript-studio/schema/commit/24173f069a9192999fa7d32efc12eba8f0300f69)
  Change default branch name to `main`
- ✨ [`aabfa9c`](https://github.com/javascript-studio/schema/commit/aabfa9c6b5b1576866ee3a23550c6b96616ab60b)
  Configure npm files
- ✨ [`5f52041`](https://github.com/javascript-studio/schema/commit/5f52041d500738ecab9a548869b6bb4882dd6297)
  Add Studio Related Tests
- ✨ [`0c4acc9`](https://github.com/javascript-studio/schema/commit/0c4acc917c5ea04c629ef7c8dcad0d31216493b6)
  Move tests next to implementation
- ✨ [`899122b`](https://github.com/javascript-studio/schema/commit/899122b903a78e3298e5c936c4c05d159ff9ae6e)
  Setup `husky` and `lint-staged`
- ✨ [`3fa0875`](https://github.com/javascript-studio/schema/commit/3fa0875b6bcd2d710d60eab6ad815a1998a672a2)
  Remove obsolete mocha env comments
- ✨ [`a1d9eea`](https://github.com/javascript-studio/schema/commit/a1d9eea5ce39e4a3d561c7aae8ee79319f224e08)
  Setup `prettier`
- ✨ [`2062827`](https://github.com/javascript-studio/schema/commit/2062827598a39e5330685fdd17e2d37725ac7ab5)
  Update `eslint`
- ✨ [`4ff13de`](https://github.com/javascript-studio/schema/commit/4ff13ded2b916f8e6b7410d0d7db51a264856c37)
  Upgrade `eslint-config`

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-06-08._

## 3.4.0

- 🍏 [`b6485e9`](https://github.com/javascript-studio/schema/commit/b6485e9d421184cf82afcd0d0d2641da8c43c45e)
  Do not throw in `toJSON`
- 🐛 [`9c806e6`](https://github.com/javascript-studio/schema/commit/9c806e6b01fcc9eacf267fd8f3dbe27a2712bef8)
  Fix `specname` generation
- ✨ [`904db4b`](https://github.com/javascript-studio/schema/commit/904db4b9665bee95ed8e7d8abf22d57050d8c44d)
  Add unit tests for one

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-06-02._

## 3.3.0

- 🍏 [`7937230`](https://github.com/javascript-studio/schema/commit/7937230b8a82f247083e4f061da86340c3ee5433)
  Unwrap object, array and map values
- ✨ [`93b0f11`](https://github.com/javascript-studio/schema/commit/93b0f11987c7ffcfb4cdc7b69eac16b382213268)
  Move raw and unwrap helpers to own file
- ✨ [`c074fc8`](https://github.com/javascript-studio/schema/commit/c074fc80c4523b936b335cf96e44f3046f73809d)
  Remove raw symbol
- ✨ [`e5963c5`](https://github.com/javascript-studio/schema/commit/e5963c56bdf68aa75688ff72741de9c62c7546ef)
  Upgrade mocha and mochify

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-06-01._

## 3.2.0

- 🍏 [`b790b41`](https://github.com/javascript-studio/schema/commit/b790b417e1ece06bbfe121e984c031fef4285197)
  Invoke `toJSON` on assigned values
- 🍏 [`857780f`](https://github.com/javascript-studio/schema/commit/857780f74de31807a4ff2059ebcb057a1e698768)
  Return original object in `toJSON`

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-05-25._

## 3.1.0

- 🍏 [`86a1a52`](https://github.com/javascript-studio/schema/commit/86a1a52a9e56a0ac0a0766ad105a72848c3d6438)
  Add literal validator
- 📚 [`d3275a0`](https://github.com/javascript-studio/schema/commit/d3275a0a46385e1ddd0bab102a36544544a32f4b)
  Document literal API and improve wording

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-05-25._

## 3.0.1

- 🐛 [`52e2945`](https://github.com/javascript-studio/schema/commit/52e29452fdafaf476b3caf949e4e213a3b32ffbd)
  Fix accessing array.length
- 🐛 [`ec44741`](https://github.com/javascript-studio/schema/commit/ec44741b93f6acd96353d22fa8435099ad56100d)
  Fix array return value

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-05-24._

## 3.0.0

- 💥 [`a5444c9`](https://github.com/javascript-studio/schema/commit/a5444c9ae6c0f251822e43d5df4d129d2034407b)
  Rename spec to schema
- 🍏 [`6728c20`](https://github.com/javascript-studio/schema/commit/6728c20f9b796cc8b098665befe6f53fca984a46)
  Support array specs
- 📚 [`3e3c8e1`](https://github.com/javascript-studio/schema/commit/3e3c8e139c80a03947394abff0152aadea9e309d)
  Change project description
- ✨ [`76d369f`](https://github.com/javascript-studio/schema/commit/76d369f9f0b20ecd106d68b293ce122a2e27b28f)
  Prefer type utility
- ✨ [`53099c7`](https://github.com/javascript-studio/schema/commit/53099c7fc22fc8d56891d9f19c42647207e7fad0)
  Cleanup

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-05-24._

## 2.0.6

- 🐛 [`afd5ce4`](https://github.com/javascript-studio/schema/commit/afd5ce4acecb8fec3af6070dd6ed6cc91738f9db)
  Emit objects with all details

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-05-23._

## 2.0.5

- 🐛 [`1668bbd`](https://github.com/javascript-studio/schema/commit/1668bbda9ead4cb71dc5529784b6b49c2d2aed7d)
  Fix array path notation
- ✨ [`34f8f24`](https://github.com/javascript-studio/schema/commit/34f8f247115962f5c0ea5d32d11396fa71e90fe8)
  Rename path helper to objectPath

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-05-23._

## 2.0.4

- 🐛 [`7bc7a62`](https://github.com/javascript-studio/schema/commit/7bc7a625ffe307b292746423550a47c93c1d1485)
  Validate arguments in array.push and array.unshift
- 🐛 [`bfcbf84`](https://github.com/javascript-studio/schema/commit/bfcbf84e4005de61ba223fd0e4bbdaae0b34e841)
  Do not throw in util.inspect(proxy)
- ✨ [`70c6fa5`](https://github.com/javascript-studio/schema/commit/70c6fa5f38aee28a092cb974aca5b205f3f035aa)
  Extract objectVerifyer to own file
- ✨ [`6fcf7b7`](https://github.com/javascript-studio/schema/commit/6fcf7b73c7add50e7b57bdfe06ccb6cff1dd63b3)
  Extract schema to own file
- ✨ [`d95ea19`](https://github.com/javascript-studio/schema/commit/d95ea191990cba1597edf59b94ba4c6d841fd768)
  Extract object to own file
- ✨ [`8b69eca`](https://github.com/javascript-studio/schema/commit/8b69eca534f6ebf00cfe2321aa9cb0780305082c)
  Extract one to own file
- ✨ [`6795da3`](https://github.com/javascript-studio/schema/commit/6795da3e5ecc6c03821eb6084d704febe571d4bb)
  Extract opt to own file
- ✨ [`15a6c02`](https://github.com/javascript-studio/schema/commit/15a6c02495cccdc82526fdabf0b86e0875e12f29)
  Extract map to own file
- ✨ [`7eb0767`](https://github.com/javascript-studio/schema/commit/7eb076791f228ad241714c94c9d6681afbc737f6)
  Extract array and createItemGetter to own file
- ✨ [`8d052b2`](https://github.com/javascript-studio/schema/commit/8d052b2c024431c5df85ce6540a4bd07ee63126b)
  Extract specTest and specTests to own file
- ✨ [`3b93150`](https://github.com/javascript-studio/schema/commit/3b9315010338eb55b6b46c87a764a57aaea7892c)
  Extract type to own file
- ✨ [`56bc5c2`](https://github.com/javascript-studio/schema/commit/56bc5c2b4756368c9672c23c1d666ac3533534e5)
  Extract verifyer to own file
- ✨ [`4e8d3c3`](https://github.com/javascript-studio/schema/commit/4e8d3c393f51464892da3bcea53b20a8b8e19e59)
  Extract path to own file
- ✨ [`7919b91`](https://github.com/javascript-studio/schema/commit/7919b916a9079132fcaead592d9e16da42fd4fda)
  Extract specName to own file
- ✨ [`e55cea6`](https://github.com/javascript-studio/schema/commit/e55cea6592efb634ecb3f47699d94cc22436cbd5)
  Extract fail helpers to own file
- ✨ [`1cab60f`](https://github.com/javascript-studio/schema/commit/1cab60fd5eb68d6b9fbc1800780870e71f1a9949)
  Extract constants to own file
- ✨ [`e8573d7`](https://github.com/javascript-studio/schema/commit/e8573d716abbbd90b64e63c545479a26e97872c5)
  Extract stringify to own file
- ✨ [`eb49c3e`](https://github.com/javascript-studio/schema/commit/eb49c3ebf6709cfb63ff62dcfbdf9b7e5280faa0)
  Extract typeOf to own file
- ✨ [`6d1a0bc`](https://github.com/javascript-studio/schema/commit/6d1a0bc776fb06fac5d9f4f24bec6135c5a2be6f)
  Extract lazy to own file
- ✨ [`a4f656a`](https://github.com/javascript-studio/schema/commit/a4f656a0c2fe4dcc5531ecff17e383af5b9b10b9)
  Avoid JSON.stringify in verifyWriter

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-05-22._

## 2.0.3

- 🐛 [`b0294d2`](https://github.com/javascript-studio/schema/commit/b0294d2b44e0e98471cd7a8ce1cff78d27c5a202)
  Ignore "then" keys in property getter
- 🐛 [`ce07b07`](https://github.com/javascript-studio/schema/commit/ce07b076ab3d0d88015f89302a5df0ea2fce5f14)
  Allow to define symbol properties

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-05-21._

## 2.0.2

- 🐛 [`06442d1`](https://github.com/javascript-studio/schema/commit/06442d11aa4a04121dc37dbe23f0714c99298705)
  Fix stringifying array and map objects

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-05-21._

## 2.0.1

- 🐛 [`3595da0`](https://github.com/javascript-studio/schema/commit/3595da0896934bbb003d519db3a3e3472dfaa51c)
  Fix nested map writer

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-05-21._

## 2.0.0

- 💥 [`b914082`](https://github.com/javascript-studio/schema/commit/b91408203f6cb7ace942a898cb9775ac0e121953)
  Version 2
- ✨ [`3240ec0`](https://github.com/javascript-studio/schema/commit/3240ec0dd41988148a4f63db4b435f19d7002acb)
  Configure GitHub actions
- ✨ [`32d473e`](https://github.com/javascript-studio/schema/commit/32d473eb88f33ee99fc6af90d4aff7b9e618dbf4)
  Upgrade Studio Changes
- ✨ [`e3d72b6`](https://github.com/javascript-studio/schema/commit/e3d72b6ef47d6835f450481dc38faec5a337ceb7)
  Update eslint config
- ✨ [`fc07195`](https://github.com/javascript-studio/schema/commit/fc07195bc7a0e276f5831b68c460a67e829a2787)
  Upgrade eslint to latest
- ✨ [`d30a00d`](https://github.com/javascript-studio/schema/commit/d30a00dd9632261f05ff0c757f73d11c527b28a4)
  Upgrade mochify to latest
- ✨ [`154c5fe`](https://github.com/javascript-studio/schema/commit/154c5feb721d0bdd36ef6c9d41dc09c9aa5e4413)
  Upgrade referee-sinon to latest
- ✨ [`669014f`](https://github.com/javascript-studio/schema/commit/669014f060049123876eabb6023e19e867007b13)
  Use npm 7
- ✨ [`4aeb227`](https://github.com/javascript-studio/schema/commit/4aeb22724e04cb38b60d1e459280f9855007aefe)
  Add `.gitignore`

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2021-05-20._

## 1.2.0

- 🍏 [`b3744e9`](https://github.com/javascript-studio/schema/commit/b3744e9fc77bc1224ec836ef0f8f0a8e601ca297)
  Implement `raw` to return original object

## 1.1.1

- 🐛 [`dbef3b5`](https://github.com/javascript-studio/schema/commit/dbef3b5d917bf849339b67e1525acdae85e26645)
  Do not throw on invalid array validation

## 1.1.0

- 🍏 [`4cbe70b`](https://github.com/javascript-studio/schema/commit/4cbe70b7638808884ccf9cc5bddcf597241dfc3f)
  Implement `"array"`
- 🐛 [`1263481`](https://github.com/javascript-studio/schema/commit/12634813cef8eb8f78cf63067c4bd8050111a73b)
  Verify array and fail with useful error message

    > Passing an invalid value caused `TypeError: Cannot read property every …`.

## 1.0.1

- 🐛 [`bf06d22`](https://github.com/javascript-studio/schema/commit/bf06d220652428f5ca26354a04f99d4d9b7bcb8a)
  Support any type of spec in array
- ✨ [`c9e79ed`](https://github.com/javascript-studio/schema/commit/c9e79eda63328ca5925c57f0c17069027c57f9f2)
  Fold type error creation into verifyer

## 1.0.0

- ✨ Initial release
