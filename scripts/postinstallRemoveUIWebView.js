/**
 * This script is used to remove the UIViewView from react-native and react-native-webview
 */
console.log('Running remove UIViewView postinstall script...')

function findFileGroupKey(file, project) {
    var fileKey = Object.keys(project.hash.project.objects['PBXFileReference']).find(k => project.hash.project.objects['PBXFileReference'][k].path === file)
    return Object.keys(project.hash.project.objects['PBXGroup'])
                 .find(k => {
                    children = project.hash.project.objects['PBXGroup'][k].children;
                    return children && children.find(c => c.value === fileKey);
                 });
}

function removeUIWebView() {
    let reactPromise = new Promise(function(resolve,reject){
        try {
            var xcode = require('xcode');
            var fs = require('fs');
            var reactProjectPath = './node_modules/react-native/React/React.xcodeproj/project.pbxproj';
            var reactProject = xcode.project(reactProjectPath);
            reactProject.parse(function(error){
                if (error) {
                    console.error(error);
                    return;
                }
                var groupKey = findFileGroupKey('RCTWebView.h', reactProject)

                if (!groupKey) {
                    console.log(`Group not found`)
                    resolve();
                    return;
                }

                console.log(`Remove files from ${groupKey}`)

                try {
                    reactProject.removeHeaderFile('RCTWebView.h', null, groupKey);
                    console.log('RCTWebView.h removed');
                } catch (error) {
                    console.log(error)
                }
                try {
                    reactProject.removeHeaderFile('RCTWebViewManager.h', null, groupKey);
                    console.log('RCTWebViewManager.h removed');
                } catch (error) {
                    console.log(error)
                }
                try {
                    reactProject.removeSourceFile('RCTWebView.m', null, groupKey);
                    console.log('RCTWebView.m removed');
                } catch (error) {
                    console.log(error)
                }
                try {
                    reactProject.removeSourceFile('RCTWebViewManager.m', null, groupKey);
                    console.log('RCTWebViewManager.m removed');
                } catch (error) {
                    console.log(error)
                }

                fs.writeFileSync(reactProjectPath, reactProject.writeSync());
                console.log('react-native UIWebView removed');
                resolve()
            });
        } catch (error) {
            if (error.code === 'MODULE_NOT_FOUND') {
                console.error("Failed to run postinstall script. Please install 'xcode' package using `npm install -g xcode` or `yarn global add xcode`")
            } else {
                console.error(error.message)
            }
            reject(error)
        }
    });
    let webViewPromise = new Promise(function(resolve,reject){
        try {
            var xcode = require('xcode');
            var fs = require('fs');
            var projectPath = './node_modules/react-native-webview/ios/RNCWebView.xcodeproj/project.pbxproj';
            var project = xcode.project(projectPath);
            project.parse(function(error){
                if (error) {
                    console.error(error);
                    return;
                }
                var groupKey = findFileGroupKey('RNCUIWebView.h', project)

                if (!groupKey) {
                    console.log(`Group not found`)
                    resolve();
                    return;
                }

                console.log(`Remove files from ${groupKey}`)

                try {
                    project.removeHeaderFile('RNCUIWebView.h', null, groupKey);
                    console.log('RNCUIWebView.h removed');
                } catch (error) {
                    console.log(error)
                }
                try {
                    project.removeHeaderFile('RNCUIWebViewManager.h', null, groupKey);
                    console.log('RNCUIWebViewManager.h removed');
                } catch (error) {
                    console.log(error)
                }
                try {
                    project.removeSourceFile('RNCUIWebView.m', null, groupKey);
                    console.log('RNCUIWebView.m removed');
                } catch (error) {
                    console.log(error)
                }
                try {
                    project.removeSourceFile('RNCUIWebViewManager.m', null, groupKey);
                    console.log('RNCUIWebViewManager.m removed');
                } catch (error) {
                    console.log(error)
                }

                fs.writeFileSync(projectPath, project.writeSync());
                console.log('react-native-webview UIWebView removed');
                resolve()
            });
        } catch (error) {
            if (error.code === 'MODULE_NOT_FOUND') {
                console.error("Failed to run postinstall script. Please install 'xcode' package using `npm install -g xcode` or `yarn global add xcode`")
            } else {
                console.error(error.message)
            }
            reject(error)
        }
    })
    return Promise.all([reactPromise, webViewPromise]);
}

removeUIWebView();