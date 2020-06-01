# wait-for-url-cli

Small CLI helper utility to wait for a url to be up

## Installation

```bash
$ npm install [-g] [--save] wait-for-url
```

## Usage

```bash
$ wait-for-url [options]
```
| arguments            | description                                           |
|----------------------|-------------------------------------------------------|
| **--url (required)** | url to perform GET requests against                   |
| **--retries**        | number of times to retry request (default: 60)        |
| **--delay**          | delay between retries in milliseconds (default: 1000) |

## Test

```bash
$ npm test
```

## Author

* [**Ryan Mottley**](mailto:ligerzero459@gmail.com) &lt;ligerzero459@gmail.com&gt;
