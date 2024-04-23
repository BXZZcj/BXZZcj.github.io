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

# INTRODUCE

## Preliminary

本课程介绍的很多概念都是以以下 2-link planar open-chain 为例：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/2-link_planar_open_chain.png" alt="2-link-planar-open_chain" width="50%">
</p>
且我们常记：
\\[
\frac{\partial{P_x}}{\partial{t}} = v_x \\\ sin(\theta_1) = s1 \\\ cos(\theta_1 + \theta_2)=c12 \\\ \frac{\partial{\theta_1}}{\partial{t}} = \dot{\theta_1}
\\]
以此类推

除了上述的 open-chain, 还有 close-chain:
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/close_chain_intro.jpg" alt="close_chain_intro" width="70%">
</p>
close-chain的雅各比矩阵奇异性非常有趣，我们后面会讲到。

<br><br>

## Forward Kinematics
如2-link planar open chain图示，由$$\theta_1,\theta_2$$得到$$P_x,P_y$$就叫Forward Kinematics.
\\[
P_x=L_1 cos\theta_1 + L_2 cos(\theta_1 + \theta_2) \\\ P_y=L_1 sin\theta_1 + L_2 sin(\theta_1 + \theta_2)
\\]

<br><br>

## Inverse Kinematics
如2-link planar open chain图示，由$$P_x,P_y$$得到$$\theta_1,\theta_2$$的过程就是Inverse Kinematics.也就是解Forward Kinematics中的那个方程。

对于图示的2-link planar open chain 而言，解的数量最多有2个，而对于有些open chain，例如3-link，则解的数量可能有无数个(参照人手抓取物体)。

<br><br>

## Jacobian Matrix & Singularity
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

那么，我们是否可以根据$$J(\theta)$$推测出end effector的运动边界？(一个半径为$$L_1+L_2$$的圆)我无法回答这个问题，因为我觉得$$J(\theta)$$是不断变化的，没有一个固定的值；没有一个固定的值，我暂时还没想到怎么算出$$(L_1+L_2)$$的运动半径来。

但我觉得，可以回答这么一个问题：在什么情况下，end effector会到达它的运动边界？我仍然没想到如何单纯从$$J(\theta)$$的形式上推导出答案，但显而易见的是，我们一看图，就知道当$$\theta_2 = 0$$时，机械臂伸直了，end effector会运动到它的边界。此时$$J(\theta)$$刚好是奇异的，也就是$$det(J(\theta))$$的值为0，也就是$$J(\theta)$$的$$col_1$$和$$col_2$$向量的方向是重合的，且刚好与此时机械臂伸直的方向是相切的，即$$\begin{bmatrix} s1 \\ c1 \end{bmatrix}$$。

当前系统这个
1. 机械臂伸直,end effector到达它的运动边界
2. $$\theta_2 = 0$$.
3. $$J(\theta)$$为奇异阵

的状态，我暂且给它取一个名字，叫做“奇异态”。表面上来看，因为$$J(\theta)$$已经是奇异的了，两个列向量已经线性相关了，无论右乘向量$$\begin{bmatrix} \dot{\theta_1} \\ \dot{\theta_2} \end{bmatrix}$$如何变化，$$J(\theta)$$都会是奇异阵，系统都处于“奇异态”，但我们上文已经说过了$$\begin{bmatrix} \dot{\theta_1} \\ \dot{\theta_2} \end{bmatrix}$$只要非0，则随着时间t流逝，它会引起$$J(\theta)$$的变化，从而会破坏系统的“奇异态”。但其实，仅仅要$$\begin{bmatrix} \dot{\theta_1} \\ \dot{\theta_2} \end{bmatrix}$$非0还不足以破坏奇异态，因为假若$$\dot{\theta_2}=0$$，即$$\theta_2\equiv 0$$，此时
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

<br><br>

## Planning using inverse kinematics

(**EX1 begin**)
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/planning_intro.jpg" alt="planning_intro" width="60%">
</p>
(**EX1 end**)

<br><br>

## Control

(**EX1 begin**)
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/control_intro.jpg" alt="control_intro" width="50%">
</p>
(**EX1 end**)

在上例中，desired path与actual path之间的误差就是control要解决的问题。引起误差的原因可能有：
- noise, disturbance
- kinematic parameter errors (比如我设计了一根杆子长1m，但制造出来后却长1.1m)
- modeling errors
- friction, elasticity, backlash
- other unmodeled errors
  
如何解决这些问题呢？就要用到feedback control

<br><br>

# Mobility (Degree of Freedom)

## Intro to DoF

如何认识自由度？先举个例子：在桌子上唯一确定一个硬币的位置。

(**EX1 begin**)

Where is the coin? How to uniquely determine its position?
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/where_is_the_coin.jpg" alt="where_is_the_coin" width="50%">
</p>

Solution 1, step by step:
- 选取一个参考系(图中已画出，左下桌角处)
- 在硬币上选取若干个点。只需要3个就够了，{A, B, C}。但对于这3个点，我们要设一定的限制，即两两点之间的距离($$L_2$$范数)固定为{$$L_1, L_2, L_3$$}。即：
\\[
d(A, B)=\sqrt{(x_A-x_B)^2+(y_A-y_B)^2}=L_1 (fixed) \\\ d(B, C)=\sqrt{(x_B-x_C)^2+(y_B-y_C)^2}=L_2 (fixed) \\\ d(A, C)=\sqrt{(x_A-x_C)^2+(y_A-y_C)^2}=L_3 (fixed)
\\]
于是，我们有了3个等式，包含6个未知数。也就是说，我们要唯一确定该硬币在桌子上的位置，需要确定3个自由变量(6-3=3)。也就是说，唯一确定硬币在桌子上位置的参数里，有3个独立变量。
<br>也就是说，如果($$x_A, y_A$$), $$x_B$$被给定了，我们就可以算出$$y_B$$, ($$x_C, y_C$$)来。如下图所示：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/DoF_coin_ABC_ideal.jpg" alt="DoF_coin_ABC_ideal" width="20%">
    </p>
    <br>但实际上，上图只是理想情况，其实还有这里应该有两种解：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/DoF_coin_ABC_multi_solutions.jpg" alt="DoF_coin_ABC_multi_solutions" width="20%">
    </p>
    针对这种两种解的情景，我们用"reflection(反射)"去描述它，即上图中上下两个解互为镜像。所以在桌面上唯一确定coin的位置的时候，我们必须限定反射是不被允许的，我们必须舍弃掉"top-solution"。

Solution 2:

- 然而，上述的方法终究不够优美，我们有另一种更优美的办法来唯一确定桌面上的硬币位置：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/DoF_coin_TR.jpg" alt="DoF_coin_TR" width="30%">
</p>
(**EX1 end**)

<br>

上述的EX1考虑的是2D空间中刚体的自由度，现在我们考虑在3D空间中刚体的自由度。

(**EX2 begin**)

<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/DoF_coin_3D.jpg" alt="DoF_coin_3D" width="30%">
</p>
假设上图中3D空间中的问题还是一个coin，我们还是要唯一确定它在3D空间中的位置，则对于上图而言，硬币质心的位移参数我们已经知道: (x, y, z)，那我们该如何确定硬币的朝向呢？也就是问，除了确定位移的3个参数外，我们该用多少个参数才能确定硬币的朝向呢？

我们仍然还是先按照Solution 1的方式来做，先在硬币上确定3个点，如图：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/three_points_coin_3D.jpg" alt="three_points_coin_3D" width="30%">
</p>
则有等式：
\\[
d(A, B)=\sqrt{(x_A-x_B)^2+(y_A-y_B)^2+(z_A-z_B)^2}=L_1 (fixed) \\\ d(B, C)=\sqrt{(x_B-x_C)^2+(y_B-y_C)^2+(z_B-z_C)^2}=L_2 (fixed) \\\ d(A, C)=\sqrt{(x_A-x_C)^2+(y_A-y_C)^2+(z_A-z_C)^2}=L_3 (fixed)
\\]
其中有3个等式，9个未知数，即6个自由/独立参数(9-3=6)，而确定硬币位移用了3个参数，所以确定转向还需要用3个参数。

(**EX2 end**)

<br><br>

## Mobility of Robot Mechanisms
现在介绍较复杂的机器人机械结构的DoF的计算。

首先介绍一些常见关节：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/common_joints.jpg" alt="common_joints" width="30%">
</p>
从左到右依次是：
- Revolute (R) joint, DoF=1
- Prismatic (P) joint, DoF=1
- Cylinderical (C) joint, DoF=2
- Universal (U) joint, DoF=2
- Spherical (S) joint, DoF=3

### Planar Robot
- 现在我们来考虑一个平面上的机器人，假设下图中椭圆形的是足：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/Planar_robot_one_leg.jpg" alt="Planar_robot_one_leg" width="30%">
    </p>
    如果只考虑一条腿，则它的DoF=3

    考虑两条腿的话，DoF=6

- 如果两条腿被用R关节铰接在一起：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/planar_robot_two_leg_linked.jpg" alt="planar_robot_two_leg_linked" width="30%">
    </p>
    则DoF=4

- 如果三条腿被用R关节铰接在一起：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/planar_robot_three_legs_linked.jpg" alt="planar_robot_three_legs_linked" width="30%">
    </p>
    则DoF=5，($$x_1, y_1, \Phi_1, \Theta_1, \Theta_2$$)

- 上述3张Planar robot的铰接用的都是DoF=1的R关节，假如我们用DoF=2的R+P联合关节呢？如下：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/planar_robot_two_legs_linked_RP.jpg" alt="planar_robot_two_legs_linked_RP" width="30%">
    </p>
    则DoF=5，($$x_1, y_1, \Phi_1, \Theta_1, d_1$$)

<br>
\sum_{i=1}^{n} a_i
由上述例子，其实我们可以总结出一个计算DoF的公式，即Gruebler Formula (**Planar Version**):
\\[
N = \\#~of~links~(including~ground) \\\ J = \\#~of~joints \\\ f_i = DoF~of~joint~i,~i=1,...,J \\\ DoF=3\dot (N-1) - \sum_{i=1}^{J} (3-f_i) = 3\dot (N-1-J) + \sum_{i=1}^{J} f_i
\\]

<br>

(**EX1 begin**)
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/dof_ex_1.jpg" alt="dof_ex_1" width="30%">
</p>
DoF=3*(5-1-5)+5=2

这意味着如果我们固定住其中两个关节点，则整个结构都会被固定住

(**EX1 end**)

(**EX2 begin**)
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/dof_ex_2.jpg" alt="dof_ex_2" width="30%">
</p>
N=8, J=9

DoF=3*(8-1-9)+9=3

(**EX2 end**)

(**EX3 begin**)
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/dof_ex_3.jpg" alt="dof_ex_3" width="40%">
</p>

每个关节链接且仅链接两个Links/Bodies! 然而，每个Link可以链接超过两个关节。

DoF=3

(**EX3 end**)

(**EX4 begin**)
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/dof_ex_4_v1.jpg" alt="dof_ex_4_v1" width="25%">
</p>
N=5, J=6, $$j_i$$=1

DoF=3*(5-1-6)+6=0

它居然不能移动！但是我们明显看上去这个结构是可以移动的啊？难道Gluebler公式出错了？是的，对于Gluebler公式来说，的确存在一些例外情况。但是在大多数情况下，Gluebler是正确的。例如，如果上述机械结构的3根Link不是等长的， Gluebler公式将会十分稳健，如下图所示，这个结构就是不能移动：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/dof_ex_4_v2.jpg" alt="dof_ex_4_v2" width="25%">
</p>
事实上，该结构中，3根link完全等长的情况在现实世界中是不存在的，所以从这种意义上来讲，Gluebler仍然是正确无误的。

(**EX4 end**)

<br>

### Spatial Mechanism
对于3D空间中的Spatial Mechanism而言，同样有**Spatial Version**的Gluebler Formula:
\\[
DoF=6\dot (N-1)-\sum_{i=1}^J (6-f_i) = 6\dot (N-1-J)+\sum_{i=1}^J f_i
\\]

(**EX1 begin**)
这是一个6*UPS platform
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/dof_ex_3D_1.jpg" alt="dof_ex_3D_1" width="30%">
</p>
DoF=6*(14-1+18)+6*(3+2+1)=6

(**EX1 end**)


(**EX2 begin**)
这是一个3*UPS platform
<p align="center">
<img src="{{site.baseurl}}/assets/img/2024-01-10-Robotics-Mechanics&Control/dof_ex_3D_2.jpg" alt="dof_ex_3D_2" width="30%">
</p>
DoF=6*(8-1-9)+3*5=3

“所以对于这个例子而言，你可以仅仅在3个Prismatic Joints处放置3个电机，就能控制整个平台的升降。并且如果你固定住任意3个joints，整个平台都动不了。”

“”里的说法看上去很对，但实际上是错的，因为DoF实际上不是3。没错，Gluebler又失效了。DoF实际上是5。上例中的机械结构实际上是一个奇异(singular)的机械结构，奇异的机械结构的DoF比Gluebler所计算的要多。

这种奇异(singular)的机械结构将会在讲close chain时详细论述。

(**EX2 end**)