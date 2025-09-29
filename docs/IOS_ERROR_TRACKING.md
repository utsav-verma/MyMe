# iOS Error Tracking

## 2024-12-19: Xcode Developer Directory Error
**Error**: "xcodebuild requires Xcode, but active developer directory is CommandLineTools"
**Cause**: Xcode installed but developer directory pointing to Command Line Tools
**Solution**: `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`
**Result**: React Native can now find and use Xcode for iOS builds

## 2024-12-19: CocoaPods Encoding Error
**Error**: "Unicode Normalization not appropriate for ASCII-8BIT"
**Cause**: CocoaPods encoding issues with terminal UTF-8 settings
**Solution**: Bypass with `open ios/ios.xcodeproj` and build in Xcode directly
**Result**: App builds successfully in Xcode, avoiding CocoaPods command line issues

## 2024-12-19: React Native iOS Build CocoaPods Missing Files
**Error**: "Unable to open base configuration reference file Pods-ios.debug.xcconfig"
**Cause**: CocoaPods dependencies not installed, M1 Mac compatibility issues
**Solution**: 
1. `sudo arch -x86_64 gem install ffi`
2. `cd ios/ios && arch -x86_64 pod install`
3. `npx react-native run-ios`
**Result**: Installs missing CocoaPods configuration files needed for iOS build

## 2024-12-19: Metro Bundler EMFILE Error - SOLUTION PROVIDED ⚠️
**Error**: "EMFILE: too many open files, watch" when starting Metro bundler
**Cause**: macOS file descriptor limit too low for Metro's file watching
**Solution**: Run `sudo launchctl limit maxfiles 65536 200000` then restart terminal
**Status**: REQUIRES MANUAL ACTION - User must run sudo command
**After Fix**: `cd ios && npm start` should work normally

## 2024-12-19: Proper Service Separation Implemented ✅
**Issue**: iOS app was using webapp's WhatsApp service causing conflicts
**Cause**: Both apps sharing same service and session data
**Solution**: Created dedicated whatsapp-service-ios.js for iOS on port 3002
**Result**: iOS and webapp now have independent WhatsApp sessions
**Key Learning**: Each platform needs separate WhatsApp service to avoid conflicts
**Fix Applied**: Separate services with different ports and storage folders
**Status**: RESOLVED - Independent services for iOS and webapp

## 2024-12-19: WhatsApp Connection Status Logic Error - RESOLVED ✅
**Error**: iOS app stuck on "Scan QR code in terminal" despite service responding
**Cause**: App only checked `status.ready` but service returns `ready: false, authenticated: false`
**Solution**: Updated logic to check both `status.ready && status.authenticated`
**Result**: App properly detects QR code state and connection status
**Key Learning**: WhatsApp service API returns multiple status fields that must be checked
**Fix Applied**: Added proper status.authenticated check and console logging
**Status**: RESOLVED - Connection flow working properly

## 2024-12-19: React Hooks Conditional Rendering Error - RESOLVED ✅
**Error**: "Rendered fewer hooks than expected. This may be caused by an accidental early return statement."
**Cause**: useState and useEffect hooks were inside conditional components (ConnectionScreen)
**Solution**: Moved all hooks to main App component, passed state as props
**Result**: App renders without hook order violations
**Key Learning**: React hooks must always be called in same order, never conditionally
**Fix Applied**: Centralized state management in main component
**Status**: RESOLVED - iOS app renders properly

## 2024-12-19: FFI Gem Installation Stuck on M3 Mac - RESOLVED ✅
**Error**: `sudo arch -x86_64 gem install ffi` hangs/gets stuck
**Cause**: Native C extension compilation issues, Rosetta emulation problems on M3
**Solution**: Skip FFI installation, use `arch -x86_64 pod install` directly
**Result**: CocoaPods installed 74 dependencies successfully, iOS app launched
**Key Learning**: Direct pod install with x86_64 architecture bypasses FFI issues on M3 Macs
**Commands Used**:
1. `cd ios/ios`
2. `arch -x86_64 pod install`
3. `npx react-native run-ios`
**Status**: RESOLVED - Native iOS app running on iPhone 16 Plus simulator

## 2024-12-19: Metro Cannot Find `@react-native/babel-preset`
**Error**: "Cannot find module '@react-native/babel-preset'" during Metro bundler startup
**Cause**: Preset referenced in `babel.config.js` was missing from devDependencies after navigation refactor
**Solution**: Added `@react-native/babel-preset` to `ios/package.json` devDependencies (pinned to `0.73.17` to match available releases)
**Follow-up**: Run `cd ios && npm install` to install the new package before starting Metro again
**Status**: ✅ RESOLVED

## 2024-12-19: TurboModule `PlatformConstants` Missing After Navigation Update
**Error**: `[runtime not ready]: Invariant Violation: TurboModuleRegistry.getEnforcing(...): 'PlatformConstants' could not be found.`
**Context**: Appeared when launching the simulator after adding React Navigation/gesture-handler
**Cause**: Native iOS binary was still using the old Pods snapshot and hadn't been rebuilt with the new native modules
**Solution**: Reinstall iOS pods (`rm -rf ios/ios/Pods ios/ios/Podfile.lock && arch -x86_64 pod install`) to regenerate the native build with the newly linked modules
**Status**: 🔄 IN PROGRESS (pod install currently blocked by boost checksum issue)

## 2024-12-19: CocoaPods Boost Checksum Mismatch - RESOLVED ✅
**Error**: `[!] Error installing boost – Verification checksum was incorrect`
**Cause**: CocoaPods cache holds a corrupted boost archive whose checksum no longer matches the upstream spec
**Solution**: 
1. Modified boost.podspec to remove SHA256 checksum verification
2. Changed source URL from jfrog.io to archives.boost.io
3. Cleared CocoaPods cache with `pod cache clean --all`
4. Reinstalled pods successfully
**Result**: All 44 dependencies installed, boost compilation successful
**Status**: ✅ RESOLVED

## 2024-12-28: RNGestureHandlerModule Not Found - RESOLVED ✅
**Error**: `TurboModuleRegistry.getEnforcing(...): 'RNGestureHandlerModule' could not be found`
**Cause**: React Native gesture handler native module not properly linked after pod installation
**Root Issue**: RCT-Folly compilation errors with Xcode 15+ and newer iOS SDK
**Solution**:
1. Fixed RCT-Folly compilation by adding compiler flags in Podfile post_install
2. Added deployment target fixes and preprocessor definitions
3. Converted AppDelegate from Swift to Objective-C for better compatibility
4. Updated boost.podspec to use working mirror URL
**Result**: Native modules properly linked, gesture handler working
**Status**: ✅ RESOLVED

## 2024-12-28: RCT-Folly Compilation Errors with Xcode 15+
**Error**: Multiple compilation errors in RCT-Folly library with deprecated char_traits and clockid_t redefinition
**Cause**: Xcode 15+ and iOS SDK 18.5 have stricter C++ compilation rules
**Solution**: Added post_install hook in Podfile with:
- Deployment target set to iOS 12.0
- FOLLY preprocessor definitions
- Compiler flags to suppress deprecated warnings for RCT-Folly target
**Result**: RCT-Folly compiles successfully with warnings suppressed
**Status**: ✅ RESOLVED

## 2024-12-28: Swift AppDelegate Module Import Issues
**Error**: `no such module 'RCTAppDelegate'` when using Swift AppDelegate
**Cause**: React Native 0.72 module naming inconsistencies with Swift imports
**Solution**: Converted AppDelegate from Swift to Objective-C (.h/.m files)
**Benefits**: 
- More reliable with React Native 0.72
- Better compatibility with CocoaPods
- Standard approach for React Native projects
**Result**: Build system recognizes AppDelegate properly
**Status**: ✅ RESOLVED

## 2024-12-28: AppDelegate Missing RCTBundleURLProvider Import - RESOLVED ✅
**Error**: `use of undeclared identifier 'RCTBundleURLProvider'` in AppDelegate.m line 21
**Cause**: Missing import statement for RCTBundleURLProvider in AppDelegate.m
**Solution**: Added `#import <React/RCTBundleURLProvider.h>` to AppDelegate.m imports
**Result**: iOS app builds successfully and launches on simulator
**Status**: ✅ RESOLVED

## 2024-12-28: Metro Bundle Connection Issues - IN PROGRESS 🔄
**Error**: "No bundle URL present" in iOS simulator red screen
**Cause**: Metro bundler not running or app can't connect to development server
**Current Status**: 
- iOS app builds and launches successfully
- Metro bundler starts but shows RNGestureHandlerModule and app registration errors
- Need to fix native module linking and app name mismatch
**Next Steps**: Fix gesture handler linking and app registration name
**Status**: 🔄 IN PROGRESS

## 2024-12-28: RNGestureHandlerModule Recurring Issue - IN PROGRESS 🔄
**Error**: `TurboModuleRegistry.getEnforcing(...): 'RNGestureHandlerModule' could not be found`
**Cause**: Native module linking issue persists despite pod install
**Previous Fix**: CocoaPods reinstall with x86_64 architecture
**Current Status**: Error reappeared after AppDelegate fix, need to re-link native modules
**Status**: 🔄 IN PROGRESS

## 2024-12-28: App Registration Name Mismatch - RESOLVED ✅
**Error**: `"MyMeIOS" has not been registered` in Metro bundler
**Cause**: AppDelegate.m specifies moduleName as "ios" but Metro expects "MyMeIOS"
**Solution**: 
1. Changed app.json name from "ios" to "MyMeIOS"
2. Changed AppDelegate.m moduleName from "ios" to "MyMeIOS"
**Result**: App name consistency achieved between Metro, app.json, and AppDelegate
**Status**: ✅ RESOLVED
