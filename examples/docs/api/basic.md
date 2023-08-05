---
marp: true
hide_table_of_contents: true
title: 'Basic API'
description: 'Basic API'
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

# Basic API

```ts
import { pl } from 'plre'

pl`
$a$ / mm	$b$ /  mm
5.22		15.05
5.35		15.05
5.26		15.05
5.26		15.05
`

pl({
        x: `14.4	38	60	82	106	129.2`,
        y: `20		40.14	60.28	80.3	100.4	120.5`,
        line: true,
        axisX: ' $S$ / mm',
        axisY: '$m$ / g',
        capture: `$S$ and $m$`,
})
```

```ts
import { pl } from 'plre'

pl(`length(p) - s`)
uniform({ s: 10 })

pl(`x ** 2 + y ** 2`)
```
