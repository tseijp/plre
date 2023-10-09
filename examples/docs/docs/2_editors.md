---
marp: true
hide_table_of_contents: true
title: 'Editors'
description: 'Editors'
image: https://github.com/tseijp.png
keywords:
        [
                glsl,
                webgl,
                hooks,
                react,
                reactjs,
                reactive,
                solid,
                solidjs,
                typescript,
        ]
date: 2023-01-01
---

# Editors

## Overview

plre boasts a diverse array of editors that allow users to view and modify various aspects of their data. Editors reside within 'Areas' in the Blender window which determines their size and positioning. Every 'Area' is capable of containing any type of editor.

## Editor Type Selector

Located on the left side of the header is the editor type selector, the primary button that lets users change the editor within its specific area. Users can also have multiple areas open with the same type of editor concurrently.

## Viewport Editor

The viewport editor is the heart of 3D scene manipulation in plre. It supports various functions like modeling, animation, and rendering. The header in this editor facilitates object operations such as adding, removing, or assigning materials. Users can manipulate viewpoints and use the transform tools window to alter object shapes. Moreover, each viewport manages its own webgl instance, rendering content onto the canvas.

## Viewlayer Editor

The viewlayer editor provides a layout that displays and allows modifications to the objects visible in the 3D scene. Users can select active objects by clicking, and can use header buttons or drag & drop mechanisms to modify the configuration. Furthermore, any changes made, such as object additions or deletions, are shared in real-time with users worldwide.

## Properties Editor

The properties editor is mainly employed for editing shaders of the selected active objects. Selection is typically done through the viewlayer, post which shaders can be modified. Once edits are finalized, clicking the compile button will reflect the changes on the user's canvas and for all users simultaneously. If any errors arise, they will be displayed on the viewport.

## Timeline Editor

An essential tool for collaborative efforts, the timeline editor showcases a list of active users in real-time. Users can edit their names and profiles, sharing them with everyone who shares the same room ID. Since room IDs are determined by URLs, changes by users within the same room are instantly reflected to all its members.

That wraps up the details for the UI and Editors sections. The following sections, such as Objects, Materials, and Collection(Operation), will delve deeper into the intricate functionalities of plre.
