# 안드로이드 배포 방법
versionCode, versionName을 업데이트.
```shell
$ cd android/app
$ vi build.gradle
```
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
$ cd app/build/outputs/bundle/release
```
`app.aab` 파일을 Google Play Console에 업로드한다.

# iOS 배포 방법
1. `project.pbxproj` 파일에서 `MARKETING_VERSION`을 업데이트한다.
1. Xcode에서 `Product > Scheme > Edit Scheme`에서 `Build Configuration`을 `Release`로 설정한다.
1. Xcode에서 `Product > Archive`를 실행한다.
1. `Xcode > Organizer`에서 배포할 버전을 선택하고 `Distribute App`을 실행한다.

1. `App Store Connect`에서 배포할 버전을 선택하고 `Submit for Review`를 실행한다.


```shell
$ npx pod-install
$ npx react-native run-ios --configuration Release
```
