// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000',
  // apiUrl: 'http://50.17.89.94:5000',
  //apiUrl: 'http://34.238.251.17:5000',
  stripe_key: 'pk_test_51IFGVwAU5WVl2sjcxEZWYlCDbKEFhXWllnVmCwWpNgqtMCoMIbxUyUdpyYHW6muvUoCw6PlBu1TVhPMCdmaqDj2e00vpSaRVs2',

  priceId360: 'price_1IPgulAU5WVl2sjcg8SyKdqW',
  priceIdSMARTSAT: 'price_1IPgwRAU5WVl2sjcyYKAXzvP',
  priceIdBootCamps: '',
  priceIdCounselling: '',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.