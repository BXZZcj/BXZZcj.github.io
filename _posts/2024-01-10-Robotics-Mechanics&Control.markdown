---
layout: post
title: "Robotics : Mechanics&Control"
date: 2024-01-10 00:00:00 +0300
description: This is the content of the course "Robotics Mechanics and Control (Based on Screw Theory)" taught by Prof. Frank Chongwoo Park. # Add post description (optional)
img: 2024-01-10-Robotics-Mechanics&Control/teaching.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [Robotics, Mechanics&Control, Screw Theory]
comments: true
---

Based on screw theory<br>
Beginners, continuously updated ...

<!-- more -->

<br><br>

本课程介绍的很多概念都是以以下 2-link planar open-chain 为例：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/2-link_planar_open_chain.png" alt="2-link-planar-open_chain" width="50%">
</p>
且我们常记：
\\[
\frac{\partial{P_x}}{\partial{t}} = v_x \\\ sin(\theta_1) = s1 \\\ cos(\theta_1 + \theta_2)=c12 \\\ \frac{\partial{\theta_1}}{\partial{t}} = \dot{\theta_1}
\\]
以此类推

<br><br>

# Forward Kinematics
如2-link planar open chain图示，由$$\theta_1,\theta_2$$得到$$P_x,P_y$$就叫Forward Kinematics.
\\[
P_x=L_1 cos\theta_1 + L_2 cos(\theta_1 + \theta_2) \\\ P_y=L_1 sin\theta_1 + L_2 sin(\theta_1 + \theta_2)
\\]

<br><br>

# Inverse Kinematics
如2-link planar open chain图示，由$$P_x,P_y$$得到$$\theta_1,\theta_2$$的过程就是Inverse Kinematics.也就是解Forward Kinematics中的那个方程。

对于图示的2-link planar open chain 而言，解的数量最多有2个，而对于有些open chain，例如3-link，则解的数量可能有无数个(参照人手抓取物体)。

<br><br>

# Jacobian Matrix & Singularity
我们控制机械臂去抓取某个坐标处的物体，肯定不是直接控制的$$(\theta_1,\theta_2)$$的值，而是控制的$$(\theta_1,\theta_2)$$其值的变化速率$$\frac{\partial{\theta}}{\partial{t}}$$，从而控制$$(P_x,P_y)$$的移动速率，从而控制End Effector向目标处移动。

则：
\\[
v_x = -L_1\; s1\; \dot{\theta_1} - L_2\; s12\; (\dot{\theta_1} + \dot{\theta_2}) \\\ v_y = L_1\; c1\; \dot{\theta_1} + L_2\; c12\; (\dot{\theta_1} + \dot{\theta_2})
\\]
即：
\\[
\begin{bmatrix}
v_x \\\ v_y
\end{bmatrix} = 
\begin{bmatrix}
-L_1\; s1 - L_2\; s12 & -L_2\; s12 \\\ L_1\; c1 + L_2\; c12 & L_2\; c12
\end{bmatrix}
\begin{bmatrix}
\dot{\theta_1} \\\ \dot{\theta_2}
\end{bmatrix}
\\]

这个$$\begin{bmatrix}-L_1\; s1 - L_2\; s12 & -L_2\; s12 \\ L_1\; c1 + L_2\; c12 & L_2\; c12 \end{bmatrix}$$便叫做Jacobian Matrix $$J(\theta)$$，Jacobian Matrix是向量对向量的一阶导。

根据上述公式，让我们思考一下：若$$\begin{bmatrix} \dot{\theta_1} \\ \dot{\theta_2} \end{bmatrix}$$持续固定值不变，则$$\begin{bmatrix} v_x \\ v_y \end{bmatrix}$$是否也会持续固定值不变，进而让End Effector沿着一个固定的方向一直运动下去呢？答案是否定的。因为虽然$$\begin{bmatrix} \dot{\theta_1} \\ \dot{\theta_2} \end{bmatrix}$$固定不变，但$$\begin{bmatrix} \dot{\theta_1} \\ \dot{\theta_2} \end{bmatrix}$$反映的是$$(\theta_1,\theta_2)$$的变化率，前者只要非0，则在时间轴上，$$(\theta_1,\theta_2)$$会变，$$J(\theta)$$跟着变，导致$$\begin{bmatrix} v_x \\ v_y \end{bmatrix}$$也变。而且一看图便知道，end effector有一个运动的范围，不会沿着一个方向不断运动下去。经过上述的思考，我们很容易想到，end effector的运动范围跟$$J(\theta)$$的性质有关。

那么，我们是否可以根据$$J(\theta)$$推测出end effector的运动边界？(实际上上一个半径为$$L_1+L_2$$的圆)我无法回答这个问题，因为我觉得$$J(\theta)$$是不断变化的，没有一个固定的值；没有一个固定的值，我暂时还没想到怎么算出$$(L_1+L_2)$$的运动半径来。

但我觉得，可以回答这么一个问题：在什么情况下，end effector会到达它的运动边界？我仍然没想到如何单纯从$$J(\theta)$$的形式上推导出答案，但显而易见的是，我们一看图，就知道当$$\theta_2 = 0$$时，机械臂伸直了，end effector会运动到它的边界。此时$$J(\theta)$$刚好是奇异的，也就是$$det(J(\theta))$$的值为0，也就是$$J(\theta)$$的$$col_1$$和$$col_2$$向量的方向是重合的，且刚好与此时机械臂伸直的方向是相切的，即$$\begin{bmatrix} s1 \\ c1 \end{bmatrix}$$。

当前系统这个
1. 机械臂伸直,end effector到达它的运动边界
2. $$\theta_2 = 0$$.
3. $$J(\theta)$$为奇异阵

的状态，我暂且给它取一个名字，叫做“奇异态”。表面上来看，因为$$J(\theta)$$已经是奇异的了，两个列向量已经线性相关了，无论右乘向量$$\begin{bmatrix} \dot{\theta_1} \\ \dot{\theta_2} \end{bmatrix}$$如何变化，$$J(\theta)$$都会是奇异阵，系统都处于“奇异态”，但我们上文已经说过了$$\begin{bmatrix} \dot{\theta_1} \\ \dot{\theta_2} \end{bmatrix}$$只要非0，则随着时间t流逝，它会引起$$J(\theta)$$的变化，从而会破坏系统的“奇异态”。但其实，也不一定非要$$\begin{bmatrix} \dot{\theta_1} \\ \dot{\theta_2} \end{bmatrix}$$非01，仅仅让$$\dot{\theta_2}=0$$就可以了，也就是让$$\theta_2\equiv 0$$，此时
\\[
\begin{bmatrix}
-L_1\; s1 - L_2\; s12 \\\ L_1\; c1 + L_2\; c12
\end{bmatrix}
\equiv
\frac{L_1+L_2}{L_2}
\begin{bmatrix}
-L_2\; s12 \\\ L_2\; c12
\end{bmatrix}
\\]
$$J(\theta)$$恒为奇异阵，系统恒为“奇异态”，end effector将绕原点做半径为$$L_1+L_2$$的圆周运动，运动方向为$$J(\theta)$$的列向量相同，即与$$\theta_1$$相切。