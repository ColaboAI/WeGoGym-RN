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
### Run instructions for Android:
- Have an Android emulator running (quickest way to get started), or a device connected.
- cd "WeGoGym" && yarn android

### Run instructions for iOS:
- cd "WeGoGym" && yarn ios

OR run from Xcode:

- Open WeGoGym/ios/WeGoGym.xcworkspace in Xcode or run "xed -b ios"
- Hit the Run button
    
### Run instructions for macOS:
- See https://aka.ms/ReactNativeGuideMacOS for the latest up-to-date instructions.
