# Release Edge Extension

This is a GitHub Action to publish an Edge extension to the Edge Web Store.

## Quick start

The minimal usage is as follows:

```yaml
- uses: baptistecdr/release-edge-extension
  with:
    api-key: ${{ secrets.EDGE_API_KEY }}
    client-id: ${{ secrets.EDGE_CLIENT_ID }}
    product-id: "Specify your product ID"
    product-path: "path/to/your/extension.zip"
```

### Inputs

All supported inputs are the following:

| Name                 | Description                                                                                    | Required | Default |
|----------------------|------------------------------------------------------------------------------------------------|----------|---------|
| `api-key`            | The API key for the Edge Web Store API                                                         | Yes      |         |
| `client-id`          | The Client ID for the Edge Web Store API associated with the API key                           | Yes      |         |
| `product-id`         | The Product ID of the Edge extension                                                           | Yes      |         |
| `product-path`       | The path to the Edge extension zip file                                                        | Yes      |         |
| `publish-notes`      | The release notes for this extension. This will be visible to users in the Edge Add-ons store. | No       |         |
| `retry-limit`        | The maximum number of retries for API calls if the operation is still in progress.             | No       | 10      |
| `retry-after-period` | The delay, in seconds, between retry attempts for API calls.                                   | No       | 5       |

## How to build

- Install [Node.JS LTS](https://nodejs.org/)
- Clone the project
- Run `npm install`
- Run `npm run package`

## Bugs and feature requests

Have a bug or a feature request? Please first search for existing and closed issues. If your problem or idea is not
addressed yet, [please open a new issue](https://github.com/baptistecdr/release-edge-extension/issues/new).

## Contributing

Contributions are welcome!
