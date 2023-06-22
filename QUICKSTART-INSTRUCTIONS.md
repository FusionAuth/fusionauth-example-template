# Quickstart Template
This is a template repo for creating FusionAuth quickstarts. If you're creating or modifying a quickstart, 
follow these guidelines so we can maintain consistency.

## What is a Quickstart?
A quickstart is a guide that takes a user through a simple OAuth auth code grant integration with FusionAuth. 
* It's specific to a language and/or framework
* It uses an off-the-shelf library, SDK, or built-in support for doing the OAuth interactions
* It has a companion example app that serves both as a working example of the integration and as the source of code snippets for the Quickstart documentation
* It's bundled with a FusionAuth docker-compose file and a kickstart file that together get FusionAuth set up to work with the given tech stack

# The TL;DR
Here are the basic things you need to do to produce a Quickstart. Read the sections below for more detail.
- [ ] Create a new repo named `fusionauth-quickstart-LANGUAGE-FRAMEWORK-{api,web}`
- [ ] Copy in the `docker-compose.yml` file and `kickstart` directory from this repo
- [ ] Edit `kickstart/kickstart.json`, editing the OAuth `authorizedRedirectURLs` and `logoutURL` values
- [ ] Create a `complete-application` directory that contains a working application
- [ ] Create a README that describes how to run the application, and that links to the Quickstart documentation
- [ ] Create the Quickstart documentation in the `fusionauth-site` repository

# Example App
Each Quickstart ships with a companion example app, which provides a working example of integrating the Quickstart's language or framework with FusionAuth.
Each example app will implement the Change Bank application, described below.

## Example App Contents

| Item | Description |
| --- |---------------|
| README.md | A description of the project, and how to run it |
| docker-compose.yml | A docker-compose config for starting FusionAuth. The docker-compose.yml can be copied from this repository. |
| kickstart/ | A directory containing a kickstart file for configuring FusionAuth. Copy the kickstart files from this repository and edit the kickstart.json with values specific to your Quickstart's tech |
| complete-application/ | A directory containing a fully working example application, which represents the end result of following the quickstart |

## Creating an Example App
To create an example app, copy the files from this repository to a new repo. Use a repo name of `fusionauth-quickstart-LANGUAGE-FRAMEWORK-{web,api}` where 
`LANGUAGE` is the base language, and `FRAMEWORK` is the library or framework being used for OAuth interactions.

For example: `fusionauth-quickstart-web-python-flask`

## Bundled FusionAuth
Each example app contains a docker-compose.yml and a kickstart file that together stand up an instance of FusionAuth with an Application configured to work with the technology or framework that is being showcased in the Quickstart. This means using the standard port(s) and path(s) for the various OAuth handoffs.
You'll need to edit `kickstart/kickstart.json`. Typically, you'll just need to edit the `authorizedRedirectURLs` and `logoutURL` properties 
of the application OAuth configuration.

```json
{
  "method": "POST",
  "url": "/api/application/#{applicationId}",
  "tenantId": "#{defaultTenantId}",
  "body": {
    "application": {
      "name": "ExampleNodeApp",
      "oauthConfiguration" : {
          "authorizedRedirectURLs": ["http://localhost:3000/oauth-callback"],
          "logoutURL": "http://localhost:4200/",
          "clientSecret": "#{clientSecret}",
          "enabledGrants": ["authorization_code", "refresh_token"]
      },
      "jwtConfiguration": {
        "enabled": true,
        "accessTokenKeyId": "#{asymmetricKeyId}",
        "idTokenKeyId": "#{asymmetricKeyId}"
      }
    }
  }
}
```

## Change Bank Application
The Change Bank application will have the following. Note that the screenshots were taken from the [FusionAuth example Python app](https://github.com/FusionAuth/fusionauth-quickstart-python-flask-web).

The image and CSS assets can be found in the `changebank/assets` directory.

Example page templates can be found in the `changebank/templates` directory.

### Home Page
The home page represents the logged-out view for a user. The home page has
  * A login button that takes the user to FusionAuth's /oauth2/authorize endpoint with the necessary parameters

![Changebank home page: no logged-in user](changebank/screenshots/changebank-loggedout.png)

### Styled Login Page
The login page is hosted by FusionAuth, and is styled to look like a Changebank page. After a successful login, the user is taken to the application page.

The theme that ships with the included kickstart file applies decent styling, so you can copy that if you're rolling your own.

![Changebank home page: logged-in user](changebank/screenshots/changebank-login.png)

### Styled Registration Page
The registration page is hosted by FusionAuth, but should be styled to look like a Changebank page. After a successful registration, the user is taken to the application page.

The theme that ships with the included kickstart file applies decent styling, so you can copy that if you're rolling your own.

![Changebank home page: logged-in user](changebank/screenshots/changebank-register.png)

### Application Page
The application page represents the logged-in view for a user. This page will contain a logout button that takes the user to FusionAuth's /oauth2/logout endpoint

![Changebank home page: logged-in user](changebank/screenshots/changebank-loggedin.png)

### Back End Endpoints / Routes
The application back end will need the following

| Path | Password-protected? | Description |
| --- | --- | --- |
| / | No | The application home page (logged-out view) |
| /callback | No | The OAuth redirect URI, where a user is redirected after successfully logging in at FusionAuth. This endpoint performs the token exchange with FusionAuth to obtain the access token, refresh token, and id token for the user. It writes these tokens as cookies. |
| /login | No | Constructs the OAuth authorize call, and redirects the user to FusionAuth's `/oauth2/authorize` endpoint |
| /logout | Yes | Deletes the user's cookies and redirects to `/` |
| /account | Yes | Takes the user to their bank account page. This page needs to be protected, so that a user needs to prove who they are before accessing a bank account. |

### Protected Endpoints
The `/account` and `/logout` endpoints need to be protected. `/account` provides access to a bank customer's bank account, so access needs to be 
authorized. It's good practice to also secure `/logout`, since a CSRF attack could be used to force a user to unwittingly log out of the application.

# Quickstart Documentation
The Quickstart documentation lives in the [fusionauth-site repo](https://github.com/FusionAuth/fusionauth-site/), in the astro/src/content/quickstarts/ directory. 
Look at the other Quickstarts to get the correct front matter for your document.

Create a new file named `quickstart-LANGUAGE-FLASK-{api,web}.mdx`, and add a front matter section to it. Be sure to at least
add title, description, section, and icon items so that the Quickstart shows up at the right place in the nav, and with the right name and icon.

In the Quickstart, take the reader through the building of an application. 

## Code References
To reference code, you'll use a plugin named `RemoteCode` to pull code out of your example application code and insert it
into your Quickstart document. Note that this happens at site generation time. If you change the remote code, it won't update
in your Quickstart doc until the site is rebuilt.

Using `RemoteCode`, you can either pull in the contents of an entire file, or you can pull in just a tagged fragment. For GitHub content, make sure you're using the raw GitHub content source, otherwise you'll pull in an HTML-encoded version of your code,
which is not what you want.

`RemoteCode` supports code formatting by using a `lang=xyz` attribute, and pulling just sections of files through the use of a `tags` attribute.

Import the `RemoteCode` component into your Quickstart doc. Do this just below the front matter block.

```javascript
import RemoteCode from '/src/components/RemoteCode.astro';
```

To import an entire file, just pass its URL to an instance of `RemoteCode`.

```html
<RemoteCode url="https://raw.githubusercontent.com/FusionAuth/REPO-NAME/main/complete-application/.env" lang="shell" />
```

To call in just a fragment of the remote code, you'll first need to tag your code.

```
#tag::baseApplication[]
some code
#end::baseApplication[]
```

The `#` here represents the single-line comment in the language of your Quickstart. To call in just a fragment,
use the `RemoteCode` component with a `tags` attribute

```html
<RemoteCode url="https://raw.githubusercontent.com/FusionAuth/REPO-NAME/main/complete-application/sourcecodefile.py"
 lang="python" />
```

## Callouts
You can add informational callouts using the `Aside` component.

```javascript
import Aside from '/src/components/Aside.astro';
```

With the `Aside` component, you can render `NOTE` and `TIP` callouts. a `NOTE` is rendered with a blue background, 
and a `TIP` with a green background.

```html
<Aside type="note"> ... </Aside>

<Aside type="tip"> ... </Aside>

```
