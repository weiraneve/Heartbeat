# RUN HeartBeat FrontEnd

## 1. How to start

```
cd HearBeat/frontend
pnpm install
pnpm start

cd HearBeat/backend
./gradlew bootRun

```

## 2. How to run unit test and view test coverage

```
cd HearBeat/frontend
pnpm coverage


cd HearBeat/frontend/coverage/lcov-report/index.html
open index.html
```

## 3. How to run e2e test

1. Start the mock server

```
cd HearBeat/stubs
docker-compose up -d
```

2. Start the backend service

```
cd HearBeat/backend
./gradlew bootRun --args='--spring.profiles.active=local --MOCK_SERVER_URL=http://localhost:4323'
```

3. Start the frontend service

```
cd HearBeat/frontend
pnpm start
```

4. Run the e2e tests

```
cd HearBeat/frontend
pnpm e2e / pnpm cypress open
```

## 4. Code development specification

1. Style naming starts with 'Styled' and distinguishes it from the parent component

```
export const StyledTypography = styled(Typography)({
  fontSize: '1rem',
})
```

2. Css units should use rem:

```
export const StyledTypography = styled('div')({
  width: '10rem',
})
```

3. Write e2e tests using POM design pattern

```
page.cy.ts:
  get headerVersion() {
    return cy.get('span[title="Heartbeat"]').parent().next()
  }


test.cy.ts:
  homePage.headerVersion.should('exist')


```

## How to use tauri mobile

- vite config port
- [android sign build reference](https://next--tauri.netlify.app/next/guides/distribution/sign-android)
build.gradle.kts config:
```
import java.util.Properties
import java.io.FileInputStream

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("rust")
}

val keyPropertiesFile = rootProject.file("key.properties")
val keyProperties = Properties()
keyProperties.load(FileInputStream(keyPropertiesFile))

android {
    compileSdk = 33
    namespace = "com.thoughtworks.app"
    defaultConfig {
        manifestPlaceholders["usesCleartextTraffic"] = "false"
        applicationId = "com.thoughtworks.app"
        minSdk = 24
        targetSdk = 33
        versionCode = 1
        versionName = "1.0"
    }
    signingConfigs {
       create("release") {
           keyAlias = keyProperties["keyAlias"] as String
           keyPassword = keyProperties["keyPassword"] as String
           storeFile = file(keyProperties["storeFile"] as String)
           storePassword = keyProperties["storePassword"] as String
       }
    }
    buildTypes {
        getByName("debug") {
            manifestPlaceholders["usesCleartextTraffic"] = "true"
            isDebuggable = true
            isJniDebuggable = true
            isMinifyEnabled = false
            packaging {                jniLibs.keepDebugSymbols.add("*/arm64-v8a/*.so")
                jniLibs.keepDebugSymbols.add("*/armeabi-v7a/*.so")
                jniLibs.keepDebugSymbols.add("*/x86/*.so")
                jniLibs.keepDebugSymbols.add("*/x86_64/*.so")
            }
        }
        getByName("release") {
            isMinifyEnabled = true
            signingConfig = signingConfigs.getByName("release")
            proguardFiles(
                *fileTree(".") { include("**/*.pro") }
                    .plus(getDefaultProguardFile("proguard-android-optimize.txt"))
                    .toList().toTypedArray()
            )
        }
    }
    ······
}
······

```
