# Welcome to Nest Js Base Code!
This base code is built with [nest js](https://nestjs.com/) framework that can help coaster to build new project
### Table of contents
  * [Build Depencies](#build-depedencies)
    * [OS Plugin](#os-plugin)
    * [Editor Plugin](#editor-plugin-please-install-these-plugin)
    * [Depencies Documentation](#dependencies-documentation-please-read-these-dependencies-docs)
  * [How To Install](#how-to-install)
  * [Basic Command](#basic-command)
    * [Running Project](#running-project)
    * [Migration](#migration)
  * [Convention](#convention)
    * [Naming](#naming)
    * [Naming Conventions](#naming-conventions)
    * [Naming Booleans](#naming-booleans)
    * [Brackets](#brackets)
    * [Spaces](#spaces)
    * [Semicolons](#semicolons)
    * [Code Comments](#code-comments)
    * [Barrels](#barrels)
  * [Http Request](#http-request)
    * [Http Request with Circuit Breaker](#http-request-with-circuit-breaker)
  * [Custom Cache](#custom-cache)
  * [Custom Helper](#custom-helper)
    * [String Convertion Helper](#string-convertion-helper)
  * [Swagger](#swagger)
  * [Folder Structure](#folder-structure)


---
<br/>
<br/>
<br/>

# Build Depedencies

## OS Plugin
- [Node Version Manager](https://github.com/nvm-sh/nvm) this plugin used for managing your node version in your OS.

## Editor Plugin (Please install these plugin)
- [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Editor Config](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)


## Dependencies Documentation (Please read these dependencies docs)
- [NodeJs](https://nodejs.org) >= 20 LTS 
- [Typescript](https://www.typescriptlang.org/docs/) = 5.1
- [NestJs](https://nestjs.com/) = 10
- ORM [Sequelize-Typescript](https://www.npmjs.com/package/sequelize-typescript) = v2.1.3
- Base ORM [Sequelize](https://sequelize.org/master/) = 6
- Cache Management [base-repo](https://github.com/FauziFadhi/base-repo) (extending sequelize function with cache feature)
- Database Migration [Umzug](https://github.com/sequelize/umzug)
- Validator [Class Validator](https://github.com/typestack/class-validator)
- Date Time Manipulation [Luxon](https://moment.github.io/luxon/#/?id=luxon)

---
<br/>
<br/>
<br/>

# How To Install

- Open your project folder
- run ``` npm i -g ts-node ```
- open base-code repo with your browser
- and copy repository git url
- and replace `<this_git_url>` with copied url to get all file from base-code repo with the following command
- run this command from your project root directory
  ```sh
  git pull <this_git_url> master --allow-unrelated-histories

  # example: git pull https://fauzifadh@bitbucket.org/rollingglory/node-basecode.git master --allow-unrelated-histories
  ```
- run `npm install`
- create public and secret key for example authentication and paste it inside `./src/modules/_common/auth/secret/` directory
- make your .env based on .env.example and fill the minimum required environment property
- run `npm run migrate up` or `ts-node migrate up` to run example database migration from migrate.ts file

- `npm run start:dev` to run your project with hot Reload

### Example Implementation
- you can see example of implementation at `src/apps/example` folder

----
<br/>
<br/>
<br/>

# Basic Command
basic command for run this project

## Running Project
Running project in default mode
   ```sh
   npm run start
   ```
<br>

Running project in `development` mode (run project with hot reload)
   ```sh
   npm run start:dev
   ```
<br>

Build project
   ```sh
   npm run start:prod
   ```
<br>

## Migration
``` 
npm run migrate <migration runner file> -- <umzug command> 
```

example create migration file: `npm run migrate core -- create --name=<filename>`

`core` from this command is the runner file at root folder. the command after double dash `--` is pure command from umzug documentation. you can find others from documentation link above.

### Example Migration 
Create new `migration` using npm
   ```sh
   npm run migrate create -- --name=your-migration-name.ts

   # example: npm run migrate create --name add-table-user.ts
   ```
   or using ts-node
   ```sh
   ts-node migrate create -- --name=your-migration-name.ts

   # example: ts-node migrate create --name add-table-user.ts
   ```
<br>

Up `migration` using npm
   ```sh
   npm run migrate up -- --name=your-file-migration-name-with-extension

   # example: npm run migrate up --name 2021.10.07T03.55.13.add-table-user.ts
   ```
   or using ts-node
   ```sh
   ts-node migrate up --name=your-file-migration-name-with-extension

   # example: ts-node migrate up --name 2021.10.07T03.55.13.add-table-user.ts
   ```
<br>

Down `migration` using npm
   ```sh
   npm run migrate down -- --name=your-file-migration-name-with-extension

   # example: npm run migrate down --name 2021.10.07T03.55.13.add-table-user.ts
   ```
   or using ts-node
   ```sh
   ts-node migrate down -- --name=your-file-migration-name-with-extension

   # example: ts-node migrate down --name 2021.10.07T03.55.13.add-table-user.ts
   ```
<br>


## Generate Model
Are you tired of manually creating files for your Nest JS projects? We have the solution for you! we have File Generator command. 

You can streamline your Nest JS development workflow by generating files with just one command. Whether you need a new `model class`, `interface`, `module`, `service`, `and controller`. our Generator has you covered.

Command:
  ```sh
   npm run gen:model -- --name module_name --modulePath module_path --modulePrefix module_prefix

   # example: npm run gen:model -- --name Booking --modulePath ./src/modules/cms --modulePrefix cms
   ```

this will generate file `model.ts`, `module.ts` , `controller.ts`, `service.ts`,  and `request.ts`. the structure folder will look like this

 - module_name // folder
 - - module.ts
 - - controllers // folder
 - - - controller.ts
 - - services // folder
 - - - service.ts
 - - request // folder
 - - - request.ts
 - - filter // folder
 - - - filter.ts

<br>

Description Parameter :

| Parameter    | Required    | Description |
| -----------  | ----------- | ----------- |
| name         | True        | Name of Module / Model. Required       |
| modulePath   | True        | path folder. Required        |
| modulePrefix | False       | Name of Prefix Module. Optional        |



<br>

---
<br/>
<br/>
<br/>

# Convention
The following guidelines convention for writing code we'd recommend [the AirBnB JavaScript Style Guide](https://github.com/airbnb/javascript), which is generally compatible with our guidelines. Here the small list of convention we are using it: 

* [Naming](#naming)
* [Naming Conventions](#naming-conventions)
* [Naming Booleans](#naming-booleans)
* [Brackets](#brackets)
* [Spaces](#spaces)
* [Semicolons](#semicolons)
* [Code Comments](#code-comments)
* [Barrels](#barrels)

### Naming

The name of a variable, function, or class, should answer all the big questions. It should tell you why it exists, what it does, and how it is used. If a name requires a comment, then the name does not reveal its intent.

**Use meaningful variable names.**

Distinguish names in such a way that the reader knows what the differences offer.

Bad:

 ``` typescript
 function isBetween(a1: number, a2: number, a3: number): boolean {
   return a2 <= a1 && a1 <= a3;
 }
```

Good: 

``` typescript
 function isBetween(value: number, left: number, right: number): boolean {
   return left <= value && value <= right;
 }
```

**Use pronounceable variable names**

If you can't pronounce it, you can't discuss it without sounding weird.

Bad:

``` typescript
class Subs {
  public ccId: number;
  public billingAddrId: number;
  public shippingAddrId: number;
}
```

Good:

``` typescript
class Subscription {
  public creditCardId: number;
  public billingAddressId: number;
  public shippingAddressId: number;
}
```

**Avoid mental mapping**

Explicit is better than implicit.<br />
*Clarity is king.*

Bad:

``` typescript
const u = getUser();
const s = getSubscription();
const t = charge(u, s);
```

Good:

``` typescript
const user = getUser();
const subscription = getSubscription();
const transaction = charge(user, subscription);
```

**Don't add unneeded context**

If your class/type/object name tells you something, don't repeat that in your variable name.

Bad:

``` typescript
type Car = {
  carMake: string;
  carModel: string;
  carColor: string;
}

function print(car: Car): void {
  console.log(`${car.carMake} ${car.carModel} (${car.carColor})`);
}
```

Good:

``` typescript
type Car = {
  make: string;
  model: string;
  color: string;
}

function print(car: Car): void {
  console.log(`${car.make} ${car.model} (${car.color})`);
}
```

### Naming Conventions

* Use camelCase for variable and function names

Bad:

``` typescript
var FooVar;
function BarFunc() { }
```

Good:

``` typescript
var fooVar;
function barFunc() { }
```

* Use camelCase of class members, interface members, methods and methods parameters

Bad:

``` typescript
class Foo {
  Bar: number;
  Baz() { }
}
```

Good:

``` typescript
class Foo {
  bar: number;
  baz() { }
}
```

* Use PascalCase for class names and interface names.

Bad:

``` typescript
class foo { }
```

Good:

``` typescript
class Foo { }
```

* Use PascalCase for enums and camelCase for enum members

Bad:

``` typescript
enum notificationTypes {
  Default = 0,
  Info = 1,
  Success = 2,
  Error = 3,
  Warning = 4
}
```

Good:

``` typescript
enum NotificationTypes {
  default = 0,
  info = 1,
  success = 2,
  error = 3,
  warning = 4
}
```

### Naming Booleans

* Don't use negative names for boolean variables.

Bad:

``` typescript
const isNotEnabled = true;
```

Good:

``` typescript
const isEnabled = false;
```

* A prefix like is, are, or has helps every developer to distinguish a boolean from another variable by just looking at it

Bad:

``` typescript
const enabled = false;
```

Good:

``` typescript
const isEnabled = false;
```

### Brackets

* **OTBS** (one true brace style). [Wikipedia](https://en.wikipedia.org/wiki/Indentation_style#Variant:_1TBS_(OTBS))

The one true brace style is one of the most common brace styles in TypeScript, in which the opening brace of a block is placed on the same line as its corresponding statement or declaration.

``` typescript
if (foo) {
  bar();
}
else {
  baz();
}
```

* Do not omit curly brackets
  
* **Always** wrap the body of the statement in curly brackets.

### Spaces

Use 2 spaces. Not tabs.

### Semicolons

Use semicolons.

### Code Comments

> So when you find yourself in a position where you need to write a comment, think it through  and  see  whether  there  isn't  some  way  to  turn  the  tables  and  express  yourself  in code. Every time you express yourself in code, you should pat yourself on the back. Everytime you  write  a  comment,  you  should  grimace  and  feel  the  failure  of  your  ability of expression.

**Bad Comments**

Most comments fall into this category. Usually they are crutches or excuses for poor code or justifications for insufficient  decisions, amounting to little more than the programmer talking to himself.

**Mumbling**

Plopping in a comment just because you feel you should or because the process requires it, is a hack. If you decide to write a comment, then spend the time necessary to make sure it is the best comment you can write.

**Noise Comments**

Sometimes you see comments that are nothing but noise. They restate the obvious and provide no new information.

``` typescript
// redirect to the Contact Details screen
this.router.navigateByUrl(`/${ROOT}/contact`);
```

``` typescript
// self explanatory, parse ...
this.parseProducts(products);
```

**Scary noise**

``` typescript
/** The name. */
private name;

/** The version. */
private version;

/** The licenceName. */
private licenceName;

/** The version. */
private info;
```

Read these comments again more carefully. Do you see the cut-paste error? If authors aren't  paying attention when comments are  written (or pasted), why should  readers be expected to profit from them?

**TODO Comments**

In general, TODO comments are a big risk. We may see something that we want to do later so we drop a quick **// TODO: Replace this method** thinking we'll come back to it but never do.

If you're going to write a TODO comment, you should link to your external issue tracker.

There are valid use cases for a TODO comment. Perhaps you're working on a big feature and you want to make a pull request that only fixes part of it. You also want to call out some refactoring that still needs to be done, but that you'll fix in another PR.

``` typescript
// TODO: Consolidate both of these classes. PURCHASE-123
```

This is actionable because it forces us to go to our issue tracker and create a ticket. That is less likely to get lost than a code comment that will potentially never be seen again. 

**Comments can sometimes be useful**

* When explaining why something is being implemented in a particular way.
* When explaining complex algorithms (when all other methods for simplifying the algorithm have been tried and come up short).

**Comment conventions**

* Write comments in *English*.
  
* Do not add empty comments
  
* Begin single-line comments with a single space
  
Good:

``` typescript
// Single-line comment
```

Bad:

``` typescript
//Single-line comment
//  Single-line comment
```

* Write single-line comments properly
  
  * Single-line comments should always be preceded by a single blank line.
  * Single-line comments should never be followed by blank line(s).

Good:

``` typescript
const x;

// This comment is valid
const y;
```

Bad:

``` typescript
const x;

// This comment is not valid

const y;
```
``` typescript
const x;
// This comment is not valid

const y;
```

* Do not write embedded comments

  * Do not write comments between declaration of statement and opening curly brackets.
  * Place comments above statements, or within statement body.

Good:

``` typescript
// This method does something..
public method() {
}
```

Bad: 

``` typescript
public method() { // This method does something..
}
```

``` typescript
public method() {
// This method does something..
}
```

### Barrels

> A barrel is a way to rollup exports from several modules into a single convenience module. The barrel itself is a module file that re-exports selected exports of other modules.

> **import noise** - this is an issue seen in languages where there are dependencies that need to be "imported", "required", or "included" and the first (1 - n) lines are non functional code.

Example of a barrel file:

``` typescript
export * from './product-added-dialog.component';
export * from './website-selector.component';
export * from './product-family-selector.component';
export * from './individual-product-selector.component';
export * from './license-type-selector.component';
export * from './period-and-quantity-selector.component';
```

How to use it inside components:

Good:

``` typescript
import { CartsService, PaidSupportService, SettingsService } from '@modules/services';
```

Bad:

``` typescript
import { SettingsService } from './settings/settings.service';
import { CartsService } from './carts/carts.service';
import { PaidSupportService } from './paid-support/paid-support.service';
```

* Barrel files are named index.ts by convention
* Do not import a barrel in the files that are already used in that barrel because this leads to circular dependency


---
<br/>
<br/>
<br/>


# Http Request
if your project need to request to 3rd Party API please install `@nestjs/axios` [Nestjs Axios](https://www.npmjs.com/package/@nestjs/axios)
from that library because the return type is `Observable` and from `rxjs` `.toPromise()` is deprecated.
please use `LastValueFrom` or `firstValueFrom`.
## Example
please use
```
const resp = await lastValueFrom(this.httpService.post())
```
instead of
```
const resp = await this.httpService.post().toPromise()

```

## Http Request with Circuit Breaker


Or you can use HttpRequest with circuit Breaker if you install this package [Circuit Breaker](https://github.com/FauziFadhi/rgb-safe-request). this package can handle http request with axios inside it and handling circuit breaker for case give `target` to recover first.

---

<br/>
<br/>

# Custom Cache
if you want to use custom cache with custom key, you can follow this [instruction](https://docs.nestjs.com/techniques/caching#interacting-with-the-cache-store)

----
<br/>
<br/>

# Custom Helper
if you want to add custom helper, please add in helper folder `src`>`utils`>`helper`

## String Convertion Helper

### Convert any case to camel case
The <b>camel case</b> naming convention requires that the <b>first letter of each word is capitalized, except for the first word</b>. For example `someName` is camel case, but `SomeName` is not. This convention is used in JavaScript for naming variables, functions and classes.

``` typescript
const toCamelCase = (str) => {
  const s = str
    && str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
      )
      .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
      .join('');
  return s.slice(0, 1).toLowerCase() + s.slice(1);
};

toCamelCase('some_database_field_name'); // 'someDatabaseFieldName'
toCamelCase('Some label that needs to be camelized');
// 'someLabelThatNeedsToBeCamelized'
toCamelCase('some-javascript-property'); // 'someJavascriptProperty'
toCamelCase('some-mixed_string with spaces_underscores-and-hyphens');
// 'someMixedStringWithSpacesUnderscoresAndHyphens'
```

### Convert any case to Pascal case
<b>Pascal case</b> is most often used in object-oriented languages like Java or C#. Pascal case strings have the <b>first letter of each word capitalized</b>. For example `SomeName` is Pascal case, but `someName` is not.

``` typescript
const toPascalCase = (str) => str
  .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
  .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
  .join('');

toPascalCase('some_database_field_name'); // 'SomeDatabaseFieldName'
toPascalCase('Some label that needs to be pascalized');
// 'SomeLabelThatNeedsToBePascalized'
toPascalCase('some-javascript-property'); // 'SomeJavascriptProperty'
toPascalCase('some-mixed_string with spaces_underscores-and-hyphens');
// 'SomeMixedStringWithSpacesUnderscoresAndHyphens'
```

### Convert any case to kebab case
<b>Kebab case</b> is most often used in URL slugs. Kebab case strings are <b>all lowercase, with words separated by hyphens</b>. For example `some-name` is kebab case, but `some-Name` is not.

``` typescript
const toKebabCase = (str) => str
  && str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join('-');

toKebabCase('camelCase'); // 'camel-case'
toKebabCase('some text'); // 'some-text'
toKebabCase('some-mixed_string With spaces_underscores-and-hyphens');
// 'some-mixed-string-with-spaces-underscores-and-hyphens'
toKebabCase('AllThe-small Things'); // 'all-the-small-things'
toKebabCase('IAmEditingSomeXMLAndHTML');
// 'i-am-editing-some-xml-and-html'
```

### Convert any case to snake case
<b>Snake case</b> is most often used in languages such as Python or Ruby. Snake case strings are <b>all lowercase, with words separated by underscores</b>. For example `some_name` is snake case, but `some_Name` is not.

``` typescript
const toSnakeCase = (str) => str
&& str
  .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
  .map((x) => x.toLowerCase())
  .join('_');

toSnakeCase('camelCase'); // 'camel_case'
toSnakeCase('some text'); // 'some_text'
toSnakeCase('some-mixed_string With spaces_underscores-and-hyphens');
// 'some_mixed_string_with_spaces_underscores_and_hyphens'
toSnakeCase('AllThe-small Things'); // 'all_the_small_things'
toSnakeCase('IAmEditingSomeXMLAndHTML');
// 'i_am_editing_some_xml_and_html'
```

### Convert any case to title case
<b>Title case</b> is most often used in titles or headings. Title case strings have the <b>first letter of each word capitalized, with words separated by spaces</b>. For example `Some Name` is title case, but `Some name` is not.

``` typescript
const toTitleCase = (str) => str
  .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
  .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1))
  .join(' ');

toTitleCase('some_database_field_name'); // 'Some Database Field Name'
toTitleCase('Some label that needs to be title-cased');
// 'Some Label That Needs To Be Title Cased'
toTitleCase('some-package-name'); // 'Some Package Name'
toTitleCase('some-mixed_string with spaces_underscores-and-hyphens');
// 'Some Mixed String With Spaces Underscores And Hyphens'
```

### Convert any case to sentence case
Finally, <b>sentence case</b> is most often used in sentences. Sentence case strings have their <b>first letter capitalized, with words separated by spaces</b>. For example `Some name` is sentence case, but `some Name` is not.

``` typescript
const toSentenceCase = (str) => {
  const s = str
      && str
        .match(
          /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
        )
        .join(' ');
  return s.slice(0, 1).toUpperCase() + s.slice(1);
};

toSentenceCase('some_database_field_name'); // 'Some database field name'
toSentenceCase('Some label that needs to be title-cased');
// 'Some label that needs to be title cased'
toSentenceCase('some-package-name'); // 'Some package name'
toSentenceCase('some-mixed_string with spaces_underscores-and-hyphens');
// 'Some mixed string with spaces underscores and hyphens'
```

----

<br/>

# Swagger
- Install the dependencies `npm install --save @nestjs/swagger@5.x.x swagger-ui-express`
- use file with these suffix [.viewmodel.ts, .transfomer.ts, .request.ts] the swagger will automatically tell the docs from those type file.
- you can use `?` to make the attribute become optional, example `age?: number`. swagger will translate the `age` to its documentation become optional
- you can see the setup config at `main.ts` file
- you can open the docs at `localhost:3000/api/docs`, if the example value not appear, `you can delete the node_modules` -> `npm i` -> `npm run buid` -> `try to re run`
<br/>

# Folder Structure

 ```Incoming```

 - src
 - - modules
 - - - _common // `business logic function that can be used at 'apps' and 'cms' module`
 - - - apps
 - - - cms
 - - - middleware // `base logic to intgerate with 3rd Party`
 - - config // `place your 3rd party config, app config here`
 - - migration // `place for migration file`
 - - models // `place for model`
 - - - core // `place for model if you has 2 or more database, and place your core data to this folder`
 - - - log // `place to this folder all model for log if you has seperate database for logging`
 - - utils
 - - - constant // `create new file of constant into this folder based on context of your constant`
 - - - - index // `export all constant file that your created here`
 - - - - auth // `place all constant that has content for authentication here`
 - - - decorator // `place your decorator file here`
 - - - enum // `create new file of enum here`
 - - - - file
 - - - error // `place your error code file here`
 - - - - index // `place your error code for general context`
 - - - - auth // `place your error code and message for authorization context`
 - - - - payment // `place your error code for payment context`
 - - - exception // `place your exception file here`
 - - - - all-exception-filter.ts // `all of your error going to this file before returned to frontend`
 - - - helper // `place your helper file here`
