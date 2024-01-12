---
layout: post
title: Computer Vision
date: 2023-10-5 1:11:00 +0300
description: This is the content of the curriculumn "Intro to Computer Vision" at Software Faulty in Tongji Univ, which is taught by Prof. Lin Zhang. # Add post description (optional)
img: camera_calibration.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [CV, Image Stitching, Monocular Measurement, Bird's Eye View Generation]
post.excerpt: Computer Vision, mathematics more than deeping learning.
---
Fam locavore snackwave bushwick +1 sartorial. Selfies portland knausgaard synth. Pop-up art party marfa deep v pitchfork subway tile 3 wolf moon. Ennui pinterest tumblr yr, adaptogen succulents copper mug twee. Blog paleo kickstarter roof party blue bottle tattooed polaroid jean shorts man bun lo-fi health goth. Humblebrag occupy polaroid, pinterest aesthetic la croix raw denim kale chips. 3 wolf moon hella church-key XOXO, t

图像拼接问题


齐次坐标：
(这里的齐次坐标概念是在老师讲射影几何之前我自己对齐次坐标的理解)
	欧氏空间中两条平行线不能相交，但它们在投影空间中是相交的，但我们用欧氏空间中的欧氏坐标没办法表达两条平行线在投影空间中相交的性质。怎么办？我们发明了齐次坐标。我认为，齐次坐标是用来表示欧氏空间中坐标的另一种方法，齐次坐标有以下几点好处：1. 齐次坐标兼容了欧氏坐标原有的性质；2.欧氏空间的欧氏坐标表示法不能用于证明两条平行线在投影空间相交，但齐次坐标能；3.齐次坐标能表达无穷远点的方向，例如(a,b,0)，而欧氏空间无穷远点只能是(inf,inf)。所以——齐次坐标是一个好工具。
	每个欧氏坐标(x/w,y/w)有无穷多个齐次坐标(x,y,w)，但只有一个规范化齐次坐标(x/w,y/w,1)。不论是规范化还是非规范化的齐次坐标，都能唯一表示一个欧氏坐标。所以说，对于齐次坐标而言，x=kx,k!=0。
	需要注意的是，欧氏空间中的点(不论是不是用齐次坐标表示)，分为两种：正常点；无穷远点。无穷远点没有规范化齐次坐标。