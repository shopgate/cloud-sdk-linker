# Shopgate's Dependency Linker

[![Travis CI Build](https://travis-ci.org/shopgate/dependency-linker.svg?branch=master)](https://travis-ci.org/shopgate/dependency-linker)
[![GitHub release](https://img.shields.io/github/release/shopgate/dependency-linker.svg)]()
[![Coverage Status](https://coveralls.io/repos/github/shopgate/dependency-linker/badge.svg?branch=master)](https://coveralls.io/github/shopgate/dependency-linker)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

This is Shopgate's Dependency linker. It supports frontend developers with automatic linking of checked out dependencies within a Shopgate Cloud project.

## Installation

```
npm i -g @shopgate/dependency-linker
```

## Usage
After installing the module you can run `link-dependencies` at the root folder of a Shopgate Cloud project.

The dependency linker will analyze the package.json to gather all linkable dependencies inside the `themes`, `extensions` and `pwa` folders. It will then link them together using `npm link`.

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

## License

Shopgate's Dependency Linker is available under the Apache License, Version 2.0.

See the [LICENSE](./LICENSE) file for more information.
