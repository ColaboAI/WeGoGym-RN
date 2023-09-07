# 안드로이드 배포 방법
## Environment setup
1. `~/.gradle/gradle.properties` 파일을 생성한다.
1. `~/.gradle/gradle.properties` 파일에 `MYAPP_RELEASE_STORE_FILE`, `MYAPP_RELEASE_KEY_ALIAS`, `MYAPP_RELEASE_STORE_PASSWORD`, `MYAPP_RELEASE_KEY_PASSWORD`를 설정한다. 해당 내용은 Discord에서 확인할 수 있다.
1. `프로젝트 루트 경로/android/app` 폴더에 *.keystore, *.pepk 파일을 복사한다.(`WEGOGYM/App Secrets`에 저장해두었음)


`android/app/build.gradle`파일의 versionCode, versionName을 업데이트.
```gradle
android {
    defaultConfig {
        versionCode N + 1
        versionName "*.*.*"
    }
}
```

```shell
$ cd android
$ ./gradlew bundleRelease 
```

`app/build/outputs/bundle/release` 경로에 저장되는
`app-release.aab` 파일을 Google Play Console에 업로드한다.

# iOS 배포 방법
## Environment setup
1. [인증서](https://dev-yakuza.posstree.com/ko/react-native/ios-certification/)를 설정한다
1. React Native [공식 문서](https://reactnative.dev/docs/publishing-to-app-store) 확인 후, 빠진 부분이 있는지 확인한다.

시뮬레이터에서 릴리즈 모드로 빌드해서 테스트 하려면 다음과 같이 실행한다.
```shell
npx pod-install
yarn ios --configuration Release
```

## 아카이브(Archive) 및 배포(Distribute)
1. `project.pbxproj` 파일에서 `MARKETING_VERSION`을 업데이트한다.
1. Xcode에서 `Product > Scheme > Edit Scheme`에서 `Build Configuration`을 `Release`로 설정한다.
1. Xcode에서 `Product > Archive`를 실행한다.
1. `Xcode > Organizer`에서 배포할 버전을 선택하고 `Distribute App`을 실행한다.

1. `App Store Connect`에서 배포할 버전을 선택하고 `Submit for Review`를 실행한다.
