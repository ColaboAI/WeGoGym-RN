# We Go Gym! Now!!!

```bash
yarn start
yarn ios or yarn android
```
## 개발 환경 세팅
[환경 설정 링크](https://reactnative.dev/docs/environment-setup)를 참고하여 세팅할 것

### iOS
```bash
brew install node
brew install watchman
brew install rbenv ruby-build

rbenv install 2.7.5
rbenv global 2.7.5

echo '# rbenv' >> ~/.zshrc &&
echo 'export PATH=~/.rbenv/bin:$PATH' >> ~/.zshrc &&
echo 'eval "$(rbenv init -)"' >> ~/.zshrc

source ~/.zshr

sudo gem install cocoapods
sudo gem install ffi --version 1.15.5
```

## Run Project

### Activate virtual environment
```bash
uvm use
```

### Run instructions for Android:
- Have an Android emulator running (quickest way to get started), or a device connected.
- cd "WeGoGym" && yarn android

### Run instructions for iOS:
1. `npx pod-install` or `cd ios && pod install`
1. `cd "WeGoGym"` && `yarn ios`

OR run from Xcode:

- Open WeGoGym/ios/WeGoGym.xcworkspace in Xcode or run "xed -b ios"
- Hit the Run button
    
### Run instructions for macOS:
- See https://aka.ms/ReactNativeGuideMacOS for the latest up-to-date instructions.


# Commit Message Convention
[Commit Message Convention Link](https://beomseok95.tistory.com/328)

## Format

- feat : 새로운 기능에 대한 커밋
- fix : 버그 수정에 대한 커밋
- build : 빌드 관련 파일 수정에 대한 커밋
- chore : 그 외 자잘한 수정에 대한 커밋
- ci : CI관련 설정 수정에 대한 커밋
- docs : 문서 수정에 대한 커밋
- style : 코드 스타일 혹은 포맷 등에 관한 커밋
- refactor :  코드 리팩토링에 대한 커밋
- test : 테스트 코드 수정에 대한 커밋


## Rules
1. 제목과 본문을 빈 행으로 구분한다
1. 제목을 50글자 내로 제한
1. 제목 첫 글자는 대문자로 작성
1. 제목 끝에 마침표 넣지 않기
1. 제목은 명령문으로 사용하며 과거형을 사용하지 않는다
1. 본문의 각 행은 72글자 내로 제한
1. 어떻게 보다는 무엇과 왜를 설명한다

# Deploy

## CodePush
### Android
```bash
appcenter codepush release-react -a ColaboAI/WeGoGym-aOS -d Staging
```
```bash
appcenter codepush release-react -a ColaboAI/WeGoGym-aOS -d {Staging/Production}
```
### iOS
```bash
appcenter codepush release-react -a ColaboAI/WeGoGym-iOS -d {Staging/Production}
```

Staging : 개발용 및 테스트용
Production : 배포용
용도에 맞게 배포할 것

이후 promote 실시
**주의사항**: 코드 푸시 배포
