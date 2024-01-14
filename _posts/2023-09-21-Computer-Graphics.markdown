---
layout: post
title: Computer Graphics
date: 2023-09-21 20:48:00 +0300
description: This is the content of the famous computer graphics course called 'GAMES101', which is taught by Prof. Lingqi Yan. # Add post description (optional)
img: 2023-09-21-Computer-Graphics/Brave_Newnew.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [CG, Rasterization, Ray Tracing]
comments: true
---

Computer Graphics without OpenGL

['GAMES101' course assignments completed by me, also being updated...](https://github.com/BXZZcj/Games101)

<!-- more -->
CG中将一个物体从3D真实物理世界投影到3D屏幕世界(假设保留了z轴深度信息)的过程分为4步：

1.	模型变换(model)：旋转平移缩放(都是刚性的)
2.	视图变换(view/camera)：从相机的观察点看场景
3.	投影变换(project)：将相机通过透视原理看到的场景映射到正则(canonical)空间中
- 透视变换(perspective)：将相机看到的frustum通过透视原理变换成cuboid
- 正交变换(orthographic)：将cuboid映射到正则空间中
4.	视口变换(viewport)：光栅化正则空间中的场景(常涉及缩放和偏移，以是的正则空间中的场景适应屏幕大小位置)
<br>

在每一轮变换中，若对点的变换矩阵是M，则对该点上的法向量的变换矩阵是M的逆转置。

关于这一点你可以自己推，推导的核心是要保证该点上的法向量和该点上的切线在变换前后仍然正交，而切线的表示可以是该点附近无限接近的两点。

而且要注意，用齐次坐标表示向量，齐次系数应该为0。不信你两个点相减试试。

<br><br>

# 视图变换：
<span style="color:red;">我们往往假设我们是往z轴的负方向看向model的</span>，这和Prof. Lin Zhang CV课有所不同(见本博客Computer Vision一贴)。
<p align="center">
  <img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/视图变换_1.png" alt="视图变换_1" width="60%">
</p>
<p align="center">
  <img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/视图变换_2.png" alt="视图变换_2" width="60%">
</p>
对于线性变换矩阵Mview的作用过程，有以下两种理解方式：

1.	复杂的理解方式：一开始，Model的坐标本来就是在x-y-z坐标系下表示的，我们要把它的坐标转换为在g-t-gxt坐标系下的表示方式。转换的句子为Mview，Mview实际上就代表了x-y-z坐标系下的各个轴在g-t-gxt坐标系下的表示方式，大概可以说Mview的每个列向量就是x-y-z坐标系的每个轴用g-t-gxt坐标系的轴线性组合的系数。
2.	简单的理解方式：g、t、gxt三根轴线和model的坐标都是在x-y-z坐标系下表示的，我们要把g,t,gxt三根轴线变换到与x-y-z轴重合，随便把model也随着g,t,gxt转换过来。于是，g,t,gxt的转换矩阵Mview也就和model的转换矩阵相同了。我们归根结底转换的不是g,t,gxt轴，而是model。

<br><br>

# 投影变换：
用一个透视投影矩阵作用一个场景的过程实际上是一个MVP(model-view-project)。

透视投影矩阵会将model变换到一个canonical(正则/规范/标准)空间中，即(-1,1)^3的空间。

透视投影矩阵Mpersp的组成部分包括正交投影矩阵Mortho，要先推导出Mortho:
<p align="center">
  <img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/投影变换_1.png" alt="投影变换_1" width="60%">
</p>
跟Prof. Lin Zhang CV课上讲的3D坐标投影到2D像素平面上损失掉Z轴上信息不同，CG中透视投影矩阵作用后，要求保留Z轴信息(主要为了透视成像后保留多个model前后顺序)，所以每一步矩阵都是4*4的。

透视投影矩阵的值跟model的near面的位置和far面的位置有关，分别记其在相机光芯坐标系Z轴上的坐标为n和f。

推导透视投影矩阵的基础假设有：
1.	从相机光芯看出去，被看到的空间是一个frustum。我们要先把frustum转换成cuboid，然后再立方投影到成像平面上。也就是说，我们要把透视投影简化成正交投影。
2.	透视投影矩阵Mpersp=Mortho * Mpersp->ortho。Mpersp->ortho将透视投影转化成立方投影的矩阵，Mortho是正交投影的矩阵。Mortho很简单。关键在Mpersp->ortho，这也就是第1点提到的“将相机看到的frustum转换成cuboid”的矩阵。
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/投影变换_2.png" alt="投影变换_2" width="60%">
    </p>
3.	model的每个点从Frustum空间转换到cuboid空间的过程是一样的，所以Mpersp->ortho中的元素不能含有x,y,z
4.	要求Mpersp->ortho，我们还要对frustum->cuboid引入4点假设：
- n面的点x,y,z坐标都不变
- f面的z坐标不变
- n和f之间的面上的点的z坐标变化后的新位置不确定
- z坐标变换的过程和x,y在Mpersp->ortho上的分量无关

求解Mpersp->ortho的过程如下：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/投影变换_3.png" alt="投影变换_3" width="60%">
</p>
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/投影变换_4.png" alt="投影变换_4" width="55%">
</p>
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/投影变换_5.png" alt="投影变换_5" width="55%">
</p>
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/投影变换_6.png" alt="投影变换_6" width="60%">
</p>
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/投影变换_7.png" alt="投影变换_7" width="45%">
</p>
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/投影变换_8.png" alt="投影变换_8" width="40%">
</p>
总之，最后的Mpersp->ortho我推导出来应该是：
\\[
\displaylines{
    \begin{bmatrix}
    n&0&0&0\\\0&n&0&0\\\0&0&n+f&-nf\\\0&0&1&0
    \end{bmatrix}
}
\\]

<br><br>

# 走样Aliasing:
走样就是失真，例如用手机去拍摄电脑屏幕产生摩尔纹，又例如图像锯齿。

走样的根本原因是采样频率过低，例如下面，采样频率过低/像素点过稀疏，导致走样/锯齿：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/走样_1.png" alt="走样_1" width="55%">
</p>
对aliasing有两种理解：

1.	简单理解：
采样频率跟不上信号频率，导致采样得到的样本点拟合不出原始信号
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/走样_2.png" alt="走样_2" width="80%">
</p>

2.	采样的本质是什么？采样的本质是对原始信号频谱的重复。

首先将采样的“冲激函数”通过傅里叶变换转换到频域，然后将原始信号的频谱的中心挨个在冲激函数的高幅值频率上重复。

假如采样过于稀疏，冲激函数频率过低，这会导致原始信号的频谱交叠重合过多，故而走样。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/走样_3.png" alt="走样_3" width="70%">
</p>

抗走样(antialiasing)的方法：
1.	提高分辨率(基于对aliasing的第一种理解)
2.	对原始信号进行低通滤波(基于对aliasing的第二种理解)：
对于未打通滤波的原始信号，低频采样导致相互交叠产生aliasing的部分往往是原始信号的高频部分：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/走样_4.png" alt="走样_4" width="60%">
    </p>
    于是我们通过低通滤波裁掉高频部分，这样低频采样就不会让原始信号的频谱产生交叠：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/走样_5.png" alt="走样_5" width="70%">
    </p>
    这里对滤波做一个补充说明，我们在空域用卷积对原始信号做的滤波，也可以对应转换成频率的滤波，即将空域的卷积核先补0后傅里叶变换：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/走样_6.png" alt="走样_6" width="70%">
    </p>
    对原始信号线进行低通滤波再采样的抗走样的例子如：

    - 先对图片做高斯模糊后采样：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/走样_7.png" alt="走样_7" width="60%">
    </p>

    - MSAA(Multisample Anti-aliasing)，看上去好像是提高采样频率，但实际上像素总数并没有变，还是先低通滤波后采样：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/走样_8.png" alt="走样_8" width="50%">
    </p>

3.	先采样后模糊，这与第2种刚好相反，但它的效果往往很差，因为它相当于是先采样得到混叠的信号，后用低通滤波对信号频谱进行截断，这样混叠的信号就还是混叠的信号。

<br><br>

# 可见性/遮挡：
- 画家算法
- 深度缓冲算法(深度图像)

<br><br>

# 着色Shading：
闫令琪：“就是将不同材质应用于不同的模型。着色和材质没什么区别，不同的材质就是不同的着色方法产生的结果。”

着色是shade，不是shadow，着色时我们只关注着色点，一个着色点是局部的，我们在对它着色时不考虑其他物体的存在，即便有其他物体遮挡了它我们也不管，所以在着色操作中，永远不可能有阴影。

对3D物体进行着色必须是在物体被透视投影之前，因为透视投影会让物体近大远小，产生畸变，而且各个点的三角形重心坐标也会失真，法向量也会失真，光线打过去的方向l就更不可靠了。
<br>

一种典型的着色模型叫做Blinn-Phong模型，它基于以下几点假设：
1.	Blinn-Phong模型关注的是物体表面光照的接收与反射。
2.	Blinn-Phong假设在环境光/漫反射/镜面高光产生之前，物体颜色是黑色的(这一点是我猜的，我加上去的)
3.	Blinn-Phong模型只考虑光源到着色点的能量耗散，不关注着色点到人眼的能量耗散。
4.	Blinn-Phong模型根据不同的光照程度将物体表面对光反射分为3种情况考虑：
- Spectual highlights(镜面高光)
- Duffuse reflect(漫反射)
- Ambient lighting(环境光)
<br>

Blinn-Phong模型对着色点的基本着色建模是这样的，其中l,n,v都是单位向量：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/着色_1.png" alt="着色_1" width="35%">
</p>
针对不同的反射光的情况，Blinn-Phong模型有以下3种公式：

1.	漫反射公式
- r是光源到着色点的距离，之所以是r^2是因为光波包络面是一个球体，球表面积是r^2
- max(0,n*l)表示光到着色点的强度，l与n越平行，接收到的光照越强
- Kd是漫反射系数，它可以是一个标量，那么Ld就是灰度值，它也可以是一个RGB向量，那么Ld就是彩色
- Ld和v无关，这就是漫反射的精髓，四面八方都反射
\\[
\textit{L}_d=k_d(I/r^2)max(0,n\cdot l)
\\]

2.	镜面反射公式
- h叫做半程向量，是l和v的正中
- 用n和h的接近程度来衡量人眼接收到的镜面反射光的强度大小，越接近就越符合真正的镜面反射的物理原理。那么为什么不直接用l关于n的对称向量R和v的接近程度来衡量呢？因为用半程向量更好算
- 相较于漫反射公式，没有用l和n的接近程度来衡量入射光的强度大小，这是一种的简化，源于镜面反射和漫反射的底层逻辑不同
- 多了一个系数p，p越大则对h和n偏移的容忍度越低，一般取100~200，也就是说要严格约束人眼接收到的反射光Ls接近于真正的镜面反射
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/着色_2.png" alt="着色_2" width="30%">
    </p>
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/着色_3.png" alt="着色_3" width="85%">
    </p>

3.	环境光反射公式
- 该公式保证了没有地方是完全黑的，这是一个大胆的简化假设
\\[
\textit{L}_a=k_a I_a
\\]

Blinn-Phong着色模型的总结如下：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/着色_4.png" alt="着色_4" width="60%">
</p>
着色模型建模了针对一个着色点的着色过程，那我们该如何把针对一个着色点的着色模型应用于整个3D model呢？

这里要引入一个着色频率的概念，分为逐面片着色/逐节点着色/逐像素着色：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/着色_5.png" alt="着色_5" width="45%">
</p>

1.	逐面片着色是对一个面片中心的点进行着色后运用于整个面片
2.	逐节点着色是对一个面片的几个角着色后将着色值通过插值运用于整个面片。它的难点在于求面片的角的节点的法向量。
3.	逐像素着色和逐节点着色接近，但更复杂，主要复杂在镜面反射光和漫反射光的处理上。求镜面反射光和漫反射光都需要法向量，对于一个面片上每个像素的法向量，我们的求法是：先求出各个角的法向量，像逐节点着色一样，然后通过插值求出每个像素的法向量，然后求每个像素着色值。

<br><br>

# 纹理texture：
纹理texture是对着色shading的改进补充。

纹理上也有像素，叫做“纹理元素/纹素”texel。

将Blinn-Phong着色模型应用于一个3D model时(不论是用什么着色频率)，可能会因为同一个3D model材质的变化(例如颜色的变化)而漫反射系数/镜面反射系数/环境光系数发生变化。

这时候，为了方便记录描述3D model表面不同部位的Kd/Ks/Ka，我们可能就需要将3D model的表面展开成一张1*1的纹理图。

3D model表面是由一张张三角形面片构成的，纹理也是，3D model到纹理的映射是面片顶点到面片顶点的映射。

从第3次作业中可以体现：纹理可以视为一张光栅化图片，每个像素都记录了属性，但是.obj文件中存储的3D模型只记录了每个三角形面片顶点的属性该在纹理中哪个位置去查询(而且这个位置坐标不是离散的)。

纹理图记录的不仅仅是Kd/Ks/Ka，还有其他很多属性。

现在是2023/9/4，就我目前所学，shading就是Kd/Ks/Ka都固定不变，而texture mapping就是使用Texture所记录的不同Kd/Ks/Ka所进行的shading，也就是说，shading和texture mapping本质上是一样的。但不管是shading还是texture mapping，都是对光栅化后的2D图像进行的处理(见于graphics pipline)。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/纹理_1.png" alt="纹理_1" width="80%">
</p>
现在是2023/09/11，我刚刚学完lecture10。根据记录的属性的不同，texture可以分为很多种，常见的是用于帮助shading的记录Kd/Ks/Ka(这些系数本质上也是颜色，只不过物体最终的颜色是通过Blinn-Phong模型的公式计算出来的)的texture。当然，也有些texture更加一步到位，直接记录物体表面的最终RGB颜色，但这样有不足，就是不能适应不同的光照方向和光照强度。

texture也可能是球形的(spherical)或者正方体形(cuboid)的，为了解释理由，我这里补充一下环境光假设：

在Blinn-Phong模型中我们已经接触过环境光了，但我们当时假设环境光是均匀的，与方向无关的，所以公式是Ka*I，但这里我再补充一下，公式里虽然没体现方向的概念，但Ka的取值与方向有关，我们在shading环境光反射的时候，要从texture查询该点对应的是哪个方向的环境光，这跟查询Ks/Kd是一样的。而且我们假设环境光的光源无限远，例如下面的例子中，虽然茶壶是在一个小房间中，但假设房间四壁打过来的环境光光源都是无限远的，所以不论房间中的茶壶如何移动，记录Ka属性的Texture都是不变的。虽然在真实物理世界中，茶壶移动了一下，那么打过来的环境光肯定不同了，texture肯定跟着变了。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/纹理_2.png" alt="纹理_2" width="65%">
</p>
为了专门服务于环境光假设(不同方向的环境光Ka可能不同)，texture的形状也不一定是方形的，也可以是球形的或是正方体形的。球形的优点是随便想要某个方向的环境光Ka都能很快查询到，缺点是你若是把它展开，它的上下部分就会出现扭曲失真，就像是展开世界地图一样。正方体形的优点是若是展开成六个平面不会失真，但是查询某个方向的Ka比较麻烦，因为你还要先事先确定目标Ka是在哪个面上。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/纹理_3.png" alt="纹理_3" width="80%">
</p>
texture还有个典型功用。

有些物体表面是凹凸不平的，要表示这种物体所需要的三角形面片数量都极多，对于计算和存储都是很大的开销。于是我们可以在建模时只建立简单的大致的模型，然后在texture中记录表面各个点的“relative height”，也就是实际物体表面和大致模型表面之间凹凸的偏差，这种叫做bump texture：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/纹理_4.png" alt="纹理_4" width="75%">
</p>
有了relative height，你就能计算物体表面任一点的法线，代入Blinn-Phong模型，就能渲染出物体表面凹凸不平的效果。由上图你可知计算法线要先计算切线，由relative height计算切线的过程有一定偏差，那为什么texture不直接记录法线？当然可以，但是这样会消耗更多存储空间。若是textrue真的记录法线，一般也不是记录世界坐标系下的法线，而是将原本的法线假定为(0,0,1)，然后记录新的偏移的法线。

记录relative height的texture叫做Bump Mapping，记录法线的texture叫做Normal Mapping，效果基本一样。它们的效果如下图所示：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/纹理_5.png" alt="纹理_5" width="75%">
</p>
但是Bump/Normal mapping有缺点就是：1.它本质上是用表面变化偏移的法线来shading，并没有真的改变3D物体的形状，是欺骗人的眼睛，所以你看它一到球形边缘就露馅；2.由于并没有真的改变表面的形状，所以在shading后如果想做进一步的阴影投影，就会失真，你看上图左右两图的阴影区别。

为了解决Bump/Normal mapping的区别，我们引入了displacement mapping，即上面右图的效果。displacement mapping的texture和bump mapping texture的值是一模一样的，但是displacement mapping会真的改变物体表面的relative height，于是这就要求3D model表面的小三角形特别多，多到采样频率高于texture的小三角形数目。这又会给存储和计算带来巨大的开销。于是directX库开发了一种不开源的算法叫做动态曲面细分dynamic tessellation，它不要求原始3D model的面片数目高于texture，而是在texture贴图过程中自动打碎3D Model的面片，凹凸多的地方就碎成更多面片，凹凸少的地方就碎成更少面片，这是种自适应的算法。
<br>
	
有些texture还是实心球体，也就是说它记录了一个3D model表面和内部的所有属性。

有些texture还用于专门记录阴影，你先对一个3D model进行简单shading，然后再把阴影texture贴上去。

<br><br>

# 图形管线graphics pipeline：
图形管线指的是把3D model转换为2D图像的基本流程。

这里的fragment是openGL里的概念，在不考虑MSAA采样点的情况下，你可以当它是像素pixel。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/图形管线_1.png" alt="图形管线_1" width="70%">
</p>

1.	model/view/perspective transformation都是Vertex processing
2.	计算frame buffer上的某个像素在不在某个三角形中，以及Z-buffer算法是Rasterizer
3.	着色既有vertex processing又有fragment processing，这是因为不同的着色频率，Gouraud和Phong着色会用到vertex processing
4.	Texture mapping也是既有vertex processing又有fragment processing

<br><br>

# 三角形重心坐标：
在三角形所处平面内，每一个点都有一个能用该三角形3个顶点的坐标的加权和表示的坐标，该坐标叫做三角形重心坐标。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/三角形重心坐标_1.png" alt="三角形重心坐标_1" width="55%">
</p>
由三角形重心坐标的推导：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/三角形重心坐标_2.png" alt="三角形重心坐标_2" width="55%">
</p>
可知：当3系数有负数时，说明该点不在三角形之内。当3系数之和不为1时，说明该点根本不在三角形所在平面内。
<br>
	
但是三角形重心坐标有不好的性质：

从旋转变换到欧氏变换到相似变换到仿射变换到射影变换，就只有相似变换及之前的变换能保证相似比不变，所以三角形所在空间经变换后，三角形重心坐标不变。但仿射变换和射影变换就不能保证。

比如在我们上面说的透视成像中，模型变换和视图变换就是欧氏变换，视口变换是相似变换，还好，但是投影变换(透视+正交)是仿射变换啊。

所以，假如我们知道一个由三角形面片构成的3D物体每个面片顶点上的属性(例如depth、color)，然后我们将这个3D物体透视投影到2D平面上后，我们想得到2D平面上某个三角形内部一个点的属性，我们不能在2D平面上计算得到(alpha、beta、gamma)，然后插值得到该点的属性，这是错误的，失真的。我们应该将这个点逆变换到3D空间中该物体对应三角形面片上的对应点上，然后在3D空间中计算得到该点的三角形重心坐标(alpha,beta,gamma)，然后再用这个(alpha,beta,gamma)来对属性做插值。

所以，假如我们目前有了一个物体的3D模型，但是它表面的属性是被记录在纹理中的，然后我们将该3D物体投影到了2D平面上。因为纹理与3D model表面的映射是面片顶点到面片顶点的映射，面片内部的点的映射我们不知道，所以若我们想知道2D平面上某个像素的点的属性，我们就需要做：将该2D坐标逆变换投影到3D模型上，计算该点在3D面片上的三角形重心坐标(alpha,beta,gamma)，然后根据3D model与纹理的映射找到纹理上对应的面片，然后对该面片顶点的坐标进行(alpha,beta,gamma)进行加权求和，得到目标点在纹理上的准确(u,v)坐标——于是就能直接在纹理上查询到该点的属性了。
<br>
	
上述我说的“加权求和”就是所谓“插值”。

上述说的插值得到(透视畸变了的)屏幕空间中某点属性的方法都涉及到将屏幕空间中的点逆变换到(未透视畸变的)真实物理空间中之后再计算(alpha,beta,gamma)，这中间有一个逆变换的步骤，很麻烦，那有没有更简单的方法呢？

有，透视矫正插值。

使用透视矫正插值的前提是：
1. 你先计算出被插值点在屏幕空间中的(alpha,beta,gamma)
2. 你有该点所处面片各顶点的深度信息，即z值。

为了对透视矫正插值做简单介绍，我们把情况简化为：
1. 被插值属性就是被插值点的深度值
2. 我们先考虑2D空间中的情形，即x-z坐标系。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/三角形重心坐标_3.png" alt="三角形重心坐标_3" width="65%">
</p>
所以，现在问题是：你得知了m和1-m，同时得知了z1和z2，你该如何求得n和1-n，从而求得zn？

可以利用辅助线+相似三角形求解：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/三角形重心坐标_4.png" alt="三角形重心坐标_4" width="70%">
</p>
自己算，在<span style="color:red;">透视矫正插值求解过程</span>中，你会发现，<span style="color:red;">真实深度值$$(Z_1,Z_2)$$和畸变后的重心坐标(m,1-m)是为了计算未畸变的重心坐标(n,1-n)的，而未畸变的重心坐标是为了计算最终被插值属性的，不论被插值的属性是深度值($$Z_n$$)还是别的什么一般属性($$A_t$$)</span>。

最终公式为：
\\[
\frac{1}{Z_n}=\frac{1-m}{Z_1+\frac{m}{Z_2}}。
\\]
推广到3D空间x-y-z坐标系就是：
\\[
\frac{1}{Z_t}=\frac{\alpha}{Z_1}+\frac{\beta}{Z_2}+\frac{\gamma}{Z_3}
\\]
<span style="color:red;">其中$$\alpha$$,$$\beta$$,$$\gamma$$是在(透视畸变了的)屏幕空间中计算出的被插值点的三角形重心坐标，$$Z_1$$，$$Z_2$$，$$Z_3$$是三角形顶点的真实深度</span>。

推广到对三角形顶点的某个属性进行插值就是：
<span style="color:red;">
\\[
\frac{A_t}{Z_t}=\alpha\times \frac{A_1}{Z_1}+\beta\times \frac{A_1}{Z_2}+\gamma\times \frac{A_1}{Z_3}
\\]
</span>
其中$$\alpha$$,$$\beta$$,$$\gamma$$是在(透视畸变了的)屏幕空间中计算出的被插值点的三角形重心坐标，$$Z_1$$，$$Z_2$$，$$Z_3$$是三角形顶点的真实深度，$$A_1$$，$$A_2$$，$$A_3$$是三角形顶点的属性。若你将$$A_1$$,$$A_2$$,$$A_3$$换成深度值，则上式会退化成1=1，所以，它是最终通用公式。
<br>

透视矫正插值相比于先把屏幕空间中坐标逆变换到真实物理空间后求($$\alpha$$,$$\beta$$,$$\gamma$$)而后插值而言，少了逆矩阵乘法的步骤。但透视矫正插值的本质还是先求得真实物理空间中的($$\alpha$$,$$\beta$$,$$\gamma$$)后再插值，本质上是一样的。

<br><br>

# 点查询与范围查询：
我们要知道屏幕空间上一个像素的属性，就需要从纹理空间中查询，假如纹理比屏幕空间小，那么像素映射到纹理上，就要通过插值查询映射点的属性，这叫做“点查询”。假如纹理比屏幕空间大，那么像素映射到纹理上，就要查询映射点周围一片点的属性的综合(通常是均值，也可能是max/min)，这叫做“范围查询”。

假如纹理比屏幕空间大，却用了点查询，就会出现以下效果：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/点查询与范围查询_1.png" alt="点查询与范围查询_1" width="70%">
</p>
在图像学中，解决范围查询有一个fast、approx、square(仅仅适用于方形的范围查询)的算法，叫做“Mipmap”，这在CV中被称作image pyramid。见下图
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/点查询与范围查询_2.png" alt="点查询与范围查询_2" width="55%">
</p>
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/点查询与范围查询_3.png" alt="点查询与范围查询_3" width="30%">
</p>
那么，知道了屏幕空间中一个像素，如何得知在纹理空间中该查询多大的范围呢？见下图：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/点查询与范围查询_4.png" alt="点查询与范围查询_4" width="60%">
</p>
在Mipmap算法中，我们计算像素点在纹理上该查询多大范围，实际上就是计算该在mip hierarchy中第几层查询。但mip hierarchy只有整数层，要是我们计算出的D是1.5该怎么办？我们就要使用三线性插值(trilinear interpolation)：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/点查询与范围查询_5.png" alt="点查询与范围查询_5" width="55%">
</p>
Mipmap算法有一个很大的优点是它基本不消耗算力，而且它只消耗比原来的纹理多1/3的存储空间，但是它有个很大的缺点就是它查询的范围只能是一个方形，对于横向或纵向的长条形它效果不好，更别说斜着的长条形或更加奇奇怪怪的形状。这通常是由于Mipmap计算出来的查询范围比本来的查询范围大所引起的。效果见下图：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/点查询与范围查询_6.png" alt="点查询与范围查询_6" width="70%">
</p>
为了适应存在很多长条形查询范围的情况，我们在mipmap的基础上引入了“各向异性过滤(anisotropic filter)”，得到Ripmap，它能够适应横向或纵向的长条形查询范围。为什么叫各向异性？我们一般的mipmap算法查询的是方形，它假设长宽相同即是查询范围各个方向的性质是相同的，所以一般的mipmap算法是“各向同性”的。ripmap相较于mipmap有一个缺点就是它会消耗相比于原始纹理3倍的存储空间。至于拿到屏幕空间中一个像素，该如何得知查询ripmap中哪一层map，这和mipmap差不多，不细讲。anisotropic filter示意图如下，你看能到，对角线上就是Mipmap：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/点查询与范围查询_7.png" alt="点查询与范围查询_7" width="35%">
</p>
但ripmap只解决了长条形查询范围的问题，针对斜着的条形或更奇怪的形状，有EWA filter(Eliptical Weighted Average Filter)，跟ripmap一样，这也是一种各向异性过滤的算法。

<br><br>

# 隐式表达和显式表达：
对几何物体的表示形式分为隐式表达和现式表达。

隐式表达例如x^3+y^3+z^3=1，表达了一个球体，你或许没办法很快想象出隐式表达的物体的形状，但是你能够很快计算出一个点是否在该物体的表面上。

显式表达例如你直接用CAD建模出一个物体的3D模型。也有特殊情况：你定义两个变量uv，遍历uv的定义域，就能通过f(u,v)=((2+cosu)*cosv, (2+cosu)*sinv, sinu)计算出对应3D模型每个点的3D坐标。这种公式形式的显式表达和隐式表达有什么区别呢？隐式表达的输入是3D坐标，显式表达的输出是3D坐标。还有理解就是：显示表示要么直接定义，要么通过参数定义。

<br><br>

# 构造性实体几何：
Constructive Solid Geometry.
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/构造性实体几何_1.png" alt="构造性实体几何_1" width="40%">
</p>

<br><br>

# DF:
Distance Function，距离函数，也是种对几何物体的隐式表达。

我们可以“水平集法Level Set Method”+SDF表示出物体的表面，下例中的level set的level=0：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/DF_1.png" alt="DF_1" width="40%">
</p>

<br><br>

# .obj文件(wavefront object file)格式：
该文件一般用于描述基于三角形网格的3D模型，其主体分为4部分：vertex(顶点)、normals(法向量)、texture coordination、face(哪些点组成一个三角形)。如下则描述了一个长方体，注意由于建模过程等各方面原因，它的vn(normals)和vt(texture)记录得似乎有点冗余：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/obj文件格式_1.png" alt="obj文件格式_1" width="80%">
</p>

<br><br>

# 贝塞尔曲线：
Bezier Curve用控制点来定义一条曲线，由n+1个控制点定义的曲线叫做n阶贝塞尔曲线。

在解析几何上，贝塞尔曲线可以表示成以n+1个控制点为参数的带参函数，参数是t，定义域是[0,1]，因变量是坐标x(t)和y(t)，所以Bezier曲线是一种通过参数定义实现的对几何形体的显式表达，你要知道曲线上的任一个点，就要先输入参数t值。你还可以对曲线上任意一个点对t求导数(<span style="color:red;">含参曲线对参数求导的结果是切线</span>)，求出来的导数是一个向量，向量的方向是切线方向，向量的长度也是有意义的：你可以把t看做时间，(x,y)看做路径，则对某点的切线的长度就是该点运动的速度。

那么，如何由t求出Bezier曲线在当前“时间”的坐标(x,y)呢？下面是3阶Bezier曲线，几何上的理解，你应该能一眼看懂：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/贝塞尔曲线_1.png" alt="贝塞尔曲线_1" width="50%">
</p>
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/贝塞尔曲线_2.png" alt="贝塞尔曲线_2" width="65%">
</p>
下面以更简单的2阶Bezier曲线为例，阐释(x(t), y(t))在解析几何上的推导：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/贝塞尔曲线_3.png" alt="贝塞尔曲线_3" width="60%">
</p>
扩展到一般形式：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/贝塞尔曲线_4.png" alt="贝塞尔曲线_4" width="60%">
</p>
其中B是伯恩斯坦公式，它其实在求对(1+(1-t))^n的多项式展开的某一项，它的参数有3个：n代表对(1+(1-t))的几阶展开，i表示展开后的第几项，t。你在固定t和n不变的情况下，你把i~[0, n]的每一项加起来，和必然为1嘛，必然的嘛。
<br>
	
Bezier曲线的良好性质：
1.	它必然从P0起始，到Pn终止
2.	对于n阶Bezier曲线，它的起始点的切线必然是n*P0P1，终点的切线必然是n*Pn-1Pn
3.	在A空间中的一条Bezier曲线，你把它的控制点仿射变换(例如透视投影变换)到B空间中，在B空间中新画出来的Bezier曲线，形状必然等于将A空间中的Bezier曲线通过同样的仿射变换变换到B空间中
4.	Bezier曲线必然在控制点的凸包里，所以假如控制点在一条直线上，那它们定义的Bezier曲线必然是这条直线段。对于凸包的阐释见下图，你应该一看就懂：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/贝塞尔曲线_5.png" alt="贝塞尔曲线_5" width="30%">
</p>
我们假如想用Bezier曲线定义一条复杂的曲线，往往不用多个控制点，因为控制点多了，你定义出来的曲线不一定像你想象中的复杂，而且非常不好控制，你改变一个控制点的位置，这个曲线可能没啥变化，例如下图：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/贝塞尔曲线_6.png" alt="贝塞尔曲线_6" width="35%">
</p>
于是我们一般用多个3阶Bezier曲线连接起来表示一条复杂的曲线，例如下图，是3条3阶Bezier曲线，我们可以通过控制每条Bezier曲线两头的两个“控制杆”来任意改变曲线的形状：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/贝塞尔曲线_7.png" alt="贝塞尔曲线_7" width="40%">
</p>
假设从左到右的曲线分别是A,B,C，我们往往希望从A到B的过渡点足够平滑，不仅仅是切线方向上相同，而且切线长度也相同(我们上面讲过，(x(t), y(t))对t求导得出来的切线的长度代表该点运动的“速度”，t是有实际意义的)，这保证了一只“蚂蚁”从A曲线爬到B曲线时，它的速度不用改变。所以，所以，我们希望AB连接处的“控制杆”方向和长度都要相同。于是我们可以说，上述Bezier曲线在AB连接处是C1连续的(C是continuity)。

有C1连续就有C0连续，它们都是描述曲线连续性的，C0连续指的是两个曲线在指定点相连，这是数值上的连续。C1连续指的是曲线的导数(在这里是对t求导得的切线)也连续，导数连续则导数不存在断点或突变点，则该点可导，则左导数等于右导数，则在此处AB连接处切线应该大小方向都相同。

但AB连接处切线方向相同，大小不同，则是不是C1连续呢？闫令琪说不是，但我觉得有待商榷，因为AB的表达式都不同，你分别用AB在连接点求导数(切线)求得的左右导数大小自然不同，但你AB若是连接处切线方向相同了，则AB肯定能用同一组控制点同一条Bezier曲线来表示吧？那假如把AB置于同一条Bezier曲线的表述下，再对该点求左右导数，则必然左右导数相同，C1连续。

但是，既然这里对一整条曲线的定义就是3条3阶Bezier曲线相连且每条Bezier曲线的t和切线都有实际意义，那我们就说只有AB连接处AB两条曲线的切线大小方向都相同时，才是C1连续吧，因为只有这样，才能让蚂蚁爬到连接处时，既不用突变方向，又不用突变速度。
<br>

### Bazier曲面：
很简单，类似于双线性插值，4*4的网格上16个控制点，先求纵轴方向上的Bezier曲线，再求横轴方向上的Bezier曲线：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/贝塞尔曲线_8.png" alt="贝塞尔曲线_8" width="75%">
</p>
求Bezier曲面的方法和求Bezier曲线的方法是相同的，后者传参t，前者传参(u,v)。
<br>

有时候我们觉得要定义一条复杂的曲线用多段3阶Bezier曲线太麻烦了，但是用多个控制点的一段n阶Bezier曲线又有很大弊端，最大的就是你要是改变一个控制点轻了，曲线几乎没有变化，你要是重了，整个曲线都会变化，而不是单单影响被改变控制点附近的曲线。于是我们就有了Spline Curve样条曲线，你不用分段定义曲线，而且你若是改变一个控制点，不会引起整体曲线的变化，但具体原理闫令琪没细讲。

<br><br>

# 网格分割和简化：
3D模型基本上都是用一个个网格表示的(大多数是三角形网格，也有其他形状)，网格越密集，3D模型越精细，但太精细也不一定好，因为很吃计算存储开销。

我们将粗糙的3D mesh变精细叫做网格分割(mesh subdivision)，将精细的3D mesh变粗糙叫做网格简化(mesh simplification)。当然也有一种操作叫网格正规化(mesh regularization)，就是将原本形状大小不一的网格尽量变得形状大小一致。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/网格分割与简化_1.png" alt="网格分割与简化_1" width="90%">
</p>
先介绍mesh subdivision的两种算法。

一、Loop Subdivision(发明者姓Loop)：

它是面向三角形网格的，分为两步。

1.	Split。在边的中点添加新点，分割一个大网格变成小网格
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/网格分割与简化_2.png" alt="网格分割与简化_2" width="50%">
</p>

2.	Assign New Position，大网格被分割后，产生3个新顶点和3个老顶点，要为它们分配新位置。对于新顶点而言，分配法则为：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/网格分割与简化_3.png" alt="网格分割与简化_3" width="55%">
    </p>
    对于老顶点而言，分配法则为：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/网格分割与简化_4.png" alt="网格分割与简化_4" width="55%">
    </p>
    对于老顶点的新位置分配法则，有一个很有意思的点，该老顶点的出度越大，说明该顶点的位置越重要，越要尽量保持它的原位置，所以original_position的权重越高，neighbor_position_sum的权重越低。
<br>

二、Catmull-Clark Subdivision：

它是面向四边形网格的，也是分两步。

但在介绍它之前，要先弄明白两个概念：quad和Non-quad，前者指四边形网格，后者指非四边形网格；Extraordinary Point和Non-extraordinary Point，奇异点和非奇异点，前者出度不为4，后者出度为4。
1.	Split：将大网格分割成小网格，方式不像Loop Subdivision只在边上添加新点，而是同时在边的中心和网格重心处添加新点，并连起来。这个过程有3个有趣的性质：1.1.Non-quad中添加的新点必然是Extra；
- 所有Non-quad都会消失；
- 第一次Split是引入新的Extra，后面就不会再产生新的Extra了。
    这个Split的过程看上去就好像是将每个Non-quad变成了Extra。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/网格分割与简化_5.png" alt="网格分割与简化_5" width="100%">
</p>

2.	Assign New Position。大网格被分割后，产生3种点：
- 面内新点f
- 边上新点e
- 旧点v
    对它们分配新位置的法则如下：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/网格分割与简化_6.png" alt="网格分割与简化_6" width="70%">
    </p>
catmull-clark算法有一个有趣的性质，就是你要是不断对一个3D模型做mesh subdivision，它最终可能会收敛成一个你意想不到的形状，在这方面还有很多研究：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/网格分割与简化_7.png" alt="网格分割与简化_7" width="70%">
</p>
接下来介绍网格简化mesh simplification。

网格简化的目的是太精细的mesh太吃资源，但有时候我们对精度要求也并不那么高，所以我们想粗糙化精细的网格。在简化的过程中，要始终遵循一个原则，就是简化后的网格远远看去要尽量和原网格相似，也就是说不能损失太多精度。例如下图1到3的简化就是较成功的：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/网格分割与简化_8.png" alt="网格分割与简化_8" width="60%">
</p>
有很多算法，这里只介绍其中一种，叫做边坍缩，其实我觉得你也可以叫它点坍缩，因为一个边两个点，这个边坍缩了，就成了一个点了嘛：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/网格分割与简化_9.png" alt="网格分割与简化_9" width="65%">
</p>
但是一个mesh模型有那么多边，你怎么知道要坍缩哪条边成一个点呢？这就要用到“二次误差度量”(“二次”的含义是L2距离)，用一条边的“最小二次误差”值给每条边打分，分数越低的说明该边在坍缩产生的的精度损失越小，越适合坍缩。

“最小二次误差”的计算就是：你将一条边简化成的一个点，然后你调整该点的位置，让该点的新位置离该边涉及到的所有面的距离之和(这就是“二次误差”)最小，这个最小距离和就是该边的“最小二次误差”。在2D空间中举一个“二次误差度量”的例子，但是它涉及两次边坍缩，也就是两条边坍缩成一个点了：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/网格分割与简化_10.png" alt="网格分割与简化_10" width="50%">
</p>
边坍缩算法首先求出一个mesh模型每条边的“最小二次误差”，作为分数，然后选择分数最小的边来坍缩。

你坍缩后原来的边会消失，还会产生新的边，于是你要重新计算此次坍缩影响到的边的最小二次误差，重新打分。

然后继续坍缩。

整个过程中你要不断进行3个操作：从现有所有边中取分数最小的边；更新新边和老边的分数；删除消失的老边的分数。于是，有一个数据结构很适合你做边坍缩mesh simplification算法：“堆”/“优先队列”。

上述你可以看出来了，边坍缩其实是一种贪心算法，每次只选择简化后对局部精度影响最小的点，它不保证最后一定收敛到最优解。

<br><br>

# 硬阴影：
点光源产生的一定是边缘锐利，非0即1的硬阴影。只有下面这种情况才会产生软阴影，其中本影Umbra也是硬的，半影Penumbra是渐变的软的：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/硬阴影_1.png" alt="硬阴影_1" width="100%">
</p>
我们前面讲到的Shading算法都是每次只考虑局部的一个点，不考虑其他物体对它的影响(阴影)，甚至不考虑同一个物体该点自己周围局部对它产生的影响。但现在我们要初步介绍点光源下硬阴影的产生了，但要注意的是，下面这种硬阴影生成算法是在光栅化的算法体系中应用的，现在我们要生成高质量的阴影一般都是在光线追踪算法体系中应用的。

首先明确，点光源下一个场景中，如果不考虑ambient shading的话，你能看到某个点，说明有光打到它，说明点光源也能看到它，于是我们转换到点光源的视角，model+view+project translation，得到点光源看到的深度图像，它也叫做shadow map，记录的是点光源所能打到的物体表面，而不能打到的地方，自然是硬阴影(不考虑环境光的话)。

然后，我们用相机视角来成像，计算出每个像素在点光源视角下的深度，并与shadow map比较，要是深度值更大(或“不等于”)，则是硬阴影。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/硬阴影_2.png" alt="硬阴影_2" width="85%">
</p>
上述方法在点光源下生成硬阴影的方法，总共分为了生成shadow map+scene with shadow两步。

上述方法有两个缺陷：
1.	只能应用于硬阴影
2.	存在数值精度问题。你scene with shadow毕竟是遍历的屏幕空间中一个个离散像素，计算出来的真实深度是不精确的浮点数，而且shadow map也是不精确的离散的浮点数，你很难真正准确得知哪些像素应该被渲染成硬阴影，哪些不该。数值精度问题的表现如下：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/硬阴影_3.png" alt="硬阴影_3" width="80%">
</p>

<br><br>

# 光线追踪：
光线追踪算法的定义可顿悟，我不详述。

光线追踪和我们上面讲到的光栅化属于两种不同的成像体系，光栅化快，但处理全局光照效应很难，光线追踪天然处理全局光照效应，但是慢。前者常常用于实时在线渲染，后者常常用于高质量离线渲染。

光线追踪算法基于3点假设：
1.	光沿着直线传播(实际上是具有波动性的)
2.	两条光线在相遇时不会碰撞冲突(实际也是错的)
3.	光从光源反射折射进入人眼(这是对的，即具备可逆性reciprocity，这也是光线追踪算法最重要的假设)
<br>

以点光源举例，光线追踪算法的基本原理是：对于屏幕空间中的每个像素，都从相机光芯发出一束光，打到物体表面，然后看看能不能反射到点光源，若能说明该折射点不是阴影，该像素能够着色。图解如下：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/光线追踪_1.png" alt="光线追踪_1" width="70%">
</p>
但上图只能说是光线追踪算法的一个原理，真正应用起来要比这复杂得多，例如光线可能会多次反射，可能存在反射……

一个简单的被应用起来的光线追踪算法叫做<span style="color:red;">Whitted-Style Ray Trace(发明者姓Whitted)，它就考虑了多次反射加折射</span>，在它的模型中，一个像素点可能会对应到多个分叉的光路，图解如下，要这里区分Primary Ray、Secondary Ray、Shadow Ray的不同概念，而且每一次折射/反射是有能量衰减的：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/光线追踪_2.png" alt="光线追踪_2" width="80%">
</p>
要具体实现像Whitted-Style这样的光线追踪算法，我们首先要解决这些问题：

1.	光路(rays)是否在场景中的几何物体表面的哪些点发生折射/反射？
2.	该往哪个方向反射/折射？
3.	能量如何衰减，反射/折射几次？
<br>

首先解决第一个问题：光路ray是否将在物体表面哪些点发生折射/反射？

首先考虑primary ray遇到的几何物体，你要定义primary ray的光路方程r(t)=o+t*d，这在NeRF里学过，不多讲。

然后大体的思路就是将光路方程代入物体表面的隐式表达中，解出t即可。

然后你要把几何物体分为两种情况：
1.	罕见的、简单的、用一个隐式表达式就可以描述表面的几何物体，以2D空间下的圆为例，很简单，只需要解(o+t*d-c)^2-R^2=0即可。若无解则与该圆不相交。
2.	常见的、复杂的、常用三角形面片显示表达的几何物体，我们如何应用“将光路方程代入物体表面的隐式表达式中解出t”呢？你可以遍历物体表面每个三角形，三角形总是有隐式表达式吧，你看看能不能解出t。但是这样有2个弊端：
- 表面三角形太多，遍历起来算着好贵。而且要考虑一个场景中所有物体，那三角形更多了，算起来更贵了。
- 对于每一个三角形，要先用它的3个顶点求出其所在平面的方程，然后将r(t)=o+t*d代入该方程，解出t，求出交点，然后看看交点在不在三个顶点内。步骤很多，麻烦，如下：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/光线追踪_3.png" alt="光线追踪_3" width="60%">
</p>
针对第2点的两个弊端，我们先解决第2个：

求光路Ray是否会穿过某个三角形，我们最终是要解出t，这一点先要明确。然后对于技巧，我们可以利用三角形重心坐标：也就是把t当做未知数，解点o+t*d在的重心坐标，重心坐标之和限制为1(即限制t决定的交点在三角形所处平面上)，只要查看各值是否为正数即可知道r(t)与三角形的交点是否在三角形内部，如下：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/光线追踪_4.png" alt="光线追踪_4" width="50%">
</p>
你看上去好像是3个未知数，但却只有一个方程，解不出来吧？不不不，每个向量长度都为3，这是个3元一次线性方程组！直接用克莱姆法则就解出来了。
<br>

针对第2点的两个弊端，我们接下来解决第1个：

这个弊端详细分析起来有两个层次。

层次1：一个场景中有太多几何物体，你要遍历每个几何物体
层次2：一个几何物体有太多三角形，你要遍历每个三角形
我们引入“包围盒”Bounding Volumn的概念，给每个几何物体定一个包围它的包围盒(形状不固定，可以是方的圆的)，然后直接查看r(t)会不会穿过这个包围盒，若否则直接跳过这个几何问题，你就不用遍历这个几何问题中所有三角形了！

为了计算方便，我们常常把包围盒取长方体，就成了Bounding Box(也可以翻译成锚框吧)。

而为了计算时更加方便，我们干脆把包围盒Bounding Box做“轴对齐”，也就是上下左右前后面都与x-y,y-z,x-z面平行，这就成了“轴对齐包围盒”Axis-Aligned Bounding Box，简称“AABB”。

假如我们已经对一个几何物体框出了AABB，我们又该如何计算r(t)是否穿过这个AABB呢？对于3D空间中的AABB，它不是有xyz 3个维度吗，每个维度有一个上下限范围，我们分别求r(t)与这3个维度范围对应的平面的交点的t值，于是你一共得到6个t值，3个是进入AABB的t值ti，3个是出AABB的t值to，你把最大的一个ti取作r(t)真正进入包围盒的时间(也就是说其他这个维度的光路也早已进入，或者说起码进入过AABB了嘛)，最小的一个to取作r(t)真正离开包围盒的时间，对于ti和to，若是to>ti且ti,to>0则r(t)肯定穿过了AABB；若是to>ti且ti<0,to>0则点光源o肯定在AABB之中；其他情况通通是没穿过包围盒。

在2D空间下举例，图示如下：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/光线追踪_5.png" alt="光线追踪_5" width="100%">
</p>
综上，你就通过列3元一次线性方程组+克莱姆法则的方法简化了r(t)与三角形面片是否有交点的求解步骤；通过轴对齐包围盒AABB的方法缓解了遍历整个场景中几何物体三角形求解是否与r(t)有交点且交点在哪的计算开销问题，但我觉得也只是缓解。

上面我们其实只考虑了r(t)是Whitted-Style算法框架下的Primary Ray的情况。

其实我们现在只解决了上述提到过的Whitted-Style Ray Trace算法3个问题其中之一：Ray是否会与物体交于哪个点？而且还没完全解决(仅Primary Ray)，而且我们重点关注如何高效不吃算力地解决这个问题(用AABB)。另外的问题有：如何反射/折射？能量衰减折射反射几次？
<br>

还有个有趣的点我想提一下，如何得知一个点是否在一个几何物体内部？思路除了由上述想到的把该点视作光源把物体视作Bounding Volumn并看看是否最大ti<最小to且to>0,ti<0之外，还有一种思路：

该点为起点引射线出去，若是它在几何体内部，则必然与几何体表面有奇数个交点，否则有偶数个交点。

<br><br>

# 补充Whitted-Style：加速结构：
上文中介绍Whitted-Style Ray Trace算法如何用AABB高效解决Ray是否与几何物体相交于哪个点，第一步要给空间中的每个几何物体分配一个AABB，然后看Ray与哪些AABB相交，然后在这些AABB中遍历几何物体表面的三角形面片，看看Ray是否与其中一个几何物体相交于哪个点。

那么，如何为场景中的“每一个”几何物体分配一个AABB呢？这其实是很难的。我们常常用比较简化的方法。

比较典型但古早的方法是对场景空间进行划分，划分成不同的包围盒(有时候还不一定是AABB)，一直不停划分，直到将包围盒划分得足够细，每个包围盒中只有少量甚至一个甚至没有几何物体。

如何将场景空间(本质上也是一个最大的包围盒)划分成细致的包围盒，有很多不同的算法。

最naïve的划分方法就是将空间均匀划分，划分后肯定有很多包围盒是空的，于是你要记录有哪些包围盒是空的，计算Ray与包围盒相交时，只需要看存在物体的包围盒就行了。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/加速结构_1.png" alt="加速结构_1" width="80%">
</p>
当然对于平均划分空间得到包围盒而言，要把空间划分为多少个包围盒也是有讲究的。
<br>
	
也有其他的空间划分方式，例如下图的Oct-Tree(八叉树方式，就是这种方式要用到八叉树)，KD-Tree(KD树，古早时代流行过的方式)，BSP-Tree(典型的包围盒不为AABB)：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/加速结构_2.png" alt="加速结构_2" width="80%">
</p>
它们基本利用了“树”的结构，其中KD-Tree是一种二叉树，Oct-Tree是在3D空间中才表现为8叉树，在2D空间中是表现为4叉树。这些树的中间节点存储了子节点的指针，以及自身包围盒位置；叶子节点存储了自身包围盒位置，以及包含哪些几何物体。

但我说了，这些直接划分空间的方式都是很古早的，已经被淘汰了，因为它们都有很大缺陷，就拿其中对空间划分得最合理的KD-Tree而言吧，它至少有两个弊端：

1.	你如何判断一个几何物体(常常是三角形)是否在一个包围盒内？三角形顶点在包围盒内吗？但万一它只是一条边在包围盒内呢？这种情况你如何定义它是否在包围盒内？
2.	假如一个几何物体跨多个包围盒，你如何决定它在哪个包围盒内？
<br>

于是，大家现在都不适用直接划分空间来得到包围盒了，大家都是直接划分几何物体，算法名为BVH(Bounding Volumn Hierarchy)。如下图所示，它也利用了树的结构，包围盒间可能有重叠：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/加速结构_3.png" alt="加速结构_3" width="80%">
</p>
将场景中物体进行划分的方式的具体步骤为：

1.	找到一个轴进行划分。通常找当前空间中最长的轴。
2.	找到该轴上正中间的物体的位置，划分两半。
<br>

划分完后，要算出光路与哪些物体相交，下面是算法伪代码，注意closest和closer，光路数学上可能穿过多个物体，但在物理上只达到最近的一个问题：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/加速结构_4.png" alt="加速结构_4" width="80%">
</p>
包围盒，以及基于包围盒与树划分出来的空间/物体，都叫做光线追踪算法的“加速结构”。

<br><br>

# 辐射度量学：
Radiometry。

Blinn-Phong着色模型中有对光照强度的衡量I，I取整数值，但这里的I实际上是没有实际物理意义的。

而辐射度量学则是准确地衡量了光照的属性，考虑了实际的物理意义。

辐射度量学中，有如下几个描述光照属性的术语：

- Radiant Energy and Flux(Power)
- intensity
- irradiance
- radiance

我们下面将一一介绍。

1.	Radiant Energy and Flux(Power)：

    这是描述光源的。

    Energy就是功，单位是焦耳J；Flux就是功率，通常用瓦特W，有时候也用流明lm。但严格而言，W包含发光发热，lm只衡量光照，甚至有时候，我们会用到一个物理量光效/效率lm/W。但在CG用到的辐射度量学中，我们一般只关心光照，所以W和lm就混为一谈都表示光照了。

    实际上，我们在CG中很少用到Energy，因为我们不考虑时间积累的效应，一般都只考虑Power。

2.	Radient Intensity

    表示每单位立体角辐射出的光照量，单位是W/sr或lm/sr。

    重点讲立体角，立体角的计算公式是球体某一块的表面积/半径平方，即$$A/r^2$$，你看它不随半径的变化而变化，就跟平面角公式是l/r一样的道理。

    已知一个球体，某处(<span style="color:red;">位置由$$\theta$$定义</span>)立体角(微分立体角)的计算公式如下：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2023-09-21-Computer-Graphics/辐射度量学_1.png" alt="辐射度量学_1" width="80%">
    </p>
    你看果然某处的立体角与半径无关吧。其实这里计算dA做了点简化，更准确的公式应该为$$dA=r sin(\theta) sin(d\phi) r sin(d\theta)$$。

    由于一个球体的表面积公式为$$4 \pi r^2$$，所以一个球体整个的立体角为$$4 pi$$，所以已知一个点光源发出的总光照量为$$\Phi$$，则其辐射强度为$$\Phi/(4 \pi)$$。

3. 

# BEING UPDATED ...