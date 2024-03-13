---
layout: post
title: "Reinforce Learning"
date: 2024-02-10 00:00:00 +0300
description: This is the curriculumn content taught by Hung-yi Lee. # Add post description (optional)
img: 2024-02-10-Reinforce-Learning/classical_framework.jpeg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [Reinforce Leaning]
comments: true
---

Beginners, continuously updated ...

<!-- more -->

<br><br>

# 强化学习和监督学习的区别：

- RL的学习过程是实时的(实时在线得到环境的反馈)，不需要人类专家预先对样本打标签
- 训练一个RL Agent常常会先用supervised-learning预训练它，然后将其置于environment里实时在线进行RL
- 对应于Supervised-learning中的epoch和batch，RL中也有epoch和step。RL中的epoch指"从游戏开始到game over"，step指的是一轮"action+reward"。不同于SL每一个batch我们都要最小化loss，在RL中，通常我们每次做最小化，都是操作多轮epoch的rewards值的平均(设每个step的reward为r，每轮epoch的rewards为R)，我们视之为R的期望值，即$$\overline{R}$$
- 有时候，一个epoch中只有一个step，也就是只会得到一次reward，例如在围棋中，只有到最后才知道输赢。
- RL中，agent玩游戏的过程可以抽象为一个strategy，即
\\[
\tau = \\{ s_1,a_1,r_1,s_2,a_2,r_2,...,s_T,a_T,r_T \\}
\\]
其中，a的得出依靠s，不依据r。
- RL的train过程可以分为on-policy和off-policy，on-policy指的是用以采样$$\tau$$的agent权重$$\theta^{'}$$和用以train的$$\theta$$是同一个$$\theta$$。这样做有个弊端，就是agent每更新一次$$\theta$$，就要重新用新的$$\theta$$去采样$$\tau$$，以准备下一轮train。于是就有人提出了off-policy train，即用以采样$$\tau$$的agent权重$$\theta^{'}$$和用以train的$$\theta$$不是同一个$$\theta$$，这样的话就可以让$$\theta^{'}$$不断采样大量$$\tau$$，而不是每次$$\theta$$更新后，都要重新用新的$$\theta$$采样一批$$\tau$$


<br><br>

# 强化学习的分类
1. Policy-based: learning a actor
   - policy-gradient
   - 更经典的RL方式，直接用环境的反馈更新自己，而不借助Q-function/critic的supervision
2. Value-based: learning a critic
   - Q-learning
   - Q-learning的function分为两种
     - State value function $$V^\pi \left( s \right)$$
     - State-action value function $$Q^\pi \left(s, a\right)$$
   - 用得多的是$$Q^\pi \left(s, a\right)$$
   - 有很多supervised-learning的影子
3. Policy-based + Value-based: Actor + Critic