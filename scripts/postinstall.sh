#!/bin/bash

SCRIPTS_DIR=scripts
NODE=node

# migrate to AndroidX
npx jetifier

# remove UIWebView from iOS to fit App Store requirement
$NODE $SCRIPTS_DIR/postinstallRemoveUIWebView.js
