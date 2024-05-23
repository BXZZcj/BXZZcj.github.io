---
layout: post
title: TinyRobotBench 🦾💡
date: 2024-05-23 1:11:00 +0300
description: This is a replication of. # Add post description (optional)
img: 2024-05-23-TinyRobotBench/TinyRobotBench_Intro.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [Embodied AI, LLM, Robotics]
comments: true
---

LLM guides robot operations

<!-- more -->
<br><br>

封面图源于 Yunlong Dong ([@东林钟声](https://www.zhihu.com/people/dong-lin-zhong-sheng-76)) 在Talk “[具身智能基础技术路线](https://www.bilibili.com/video/BV1d5ukedEsi/?share_source=copy_web&vd_source=cb1cf03f7c336aa2574bfcb61ce673e1)” 中的对其博文“[Robotics+LLM系列TinyRobotBench开篇](https://zhuanlan.zhihu.com/p/667452905)”的引述。

<br><br>

## 我在网上冲浪时看到一篇有趣的文章

[![东林钟声知乎文章]({{site.baseurl}}/assets/img/2024-05-23-TinyRobotBench/TinyRobotBench_Yunlong.png)](https://zhuanlan.zhihu.com/p/667452905)

该文章描述了一个LLM指导Robot做任务的项目，大概内容就是：
- 针对特定任务维护一个机器人高层（High-Level）API，主要包括感知（定位物体、识别物体等）、控制（移动、抓取）等
- 构建Prompt，描述目标并且指定当前可用的机器人操作API，喂给LLM
- 将LLM生成的代码部署机器人上

虽然这个项目很Toy，但我觉得它对于一个Embodied AI初学者来说很有用，有助于打通LLM指导Robot做任务的大体流程。你知道的，现在 LLM + Robotics 的套路在Embodied AI社区非常火，变着花样发文章。

但是，该项目并没有开源代码(大概是作者认为它太Toy了，没有开源的意义)，然后我还看到评论区有人在向作者求代码，但作者并没有回复

<p align="center">
  <img src="{{site.baseurl}}/assets/img/2024-05-23-TinyRobotBench/TinyRobotBench_Yunlong_Comments.png" alt="评论区" width="70%">
</p>

<br><br>

## 于是我心血来潮将该项目复现，主要内容包括：
- 一套基本的机器人操作的API (based on sapien)
- 一个部署LLM，发布LLM API的工具 (based on HF transformers)
- 一个ChatBot Web UI (based on chainlit & langchain, 支持RAG与Multi-Modal, 暂时对该项目没有什么用)

效果如下：

<video width="100%" controls>
  <source src="{{site.baseurl}}/assets/img/2024-05-23-TinyRobotBench/Demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

<br>

<p align="center">
  <img src="{{site.baseurl}}/assets/img/2024-05-23-TinyRobotBench/ChatBot.png" alt="ChatBot" width="100%">
</p>

## 代码已上传至 GitHub: 
[👆️](https://github.com/BXZZcj/TinyRobotBench)