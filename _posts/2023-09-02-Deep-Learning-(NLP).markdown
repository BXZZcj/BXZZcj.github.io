---
layout: post
title: Deep Learning (NLP)
date: 2023-09-02 00:23:00 +0300
description: This is the content of the course "Dive Into Deep Learning" at Bilibili, which is taught by Mr. Mu Li. # Add post description (optional)
img: 2023-09-02-Deep-Learning-NLP/encoder_decoder.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [DL, NLP, RNN, encoder-decoder, text pre-process, attention]
comments: true
---

Naive NLP...<br>
[An open-source chatbot configuration tool available on GitHub](https://github.com/BXZZcj/ChatEase-Streamlined-Server-Chatbot-Configuration)

<!-- more -->
<br><br>
# 序列模型：
我觉得序列模型分两个task，一个task是没有给定输入，直接预测一段序列的出现概率(常常是基于统计的method)；一个task是给定一段输入序列，预测下一个或多个元素(常常是基于learning的method)。

序列模型就是要预测的数据$$x_t$$与过去的数据$$x_i$$相关，也就是说，你能用过去的数据$$x_i$$预测当前的数据$$x_t$$(这么说好像是接近于一个回归模型了，但实际上序列模型也可以做分类)。并且，理论上来说，当前数据$$x_t$$应当与过去已知的全部数据$$x_i$$相关。像这个样子的，要预测的label数据和用来预测的feature数据是同一类数据的模型，被称为“自回归模型”。

由于上面说的序列模型当前要预测的数据和过去所有数据相关的特性，在数学上，我们常常可以用条件概率来表示一个序列模型，即：$$y=p(x_t \vert x_1 x_2 x_3 … x_{t-1}) $$ 。我们说，我们会训练出一个模型$$f(x_1 x_2 x_3 … x_{t-1}) = p(x_t^{'} \vert x_1 x_2 x_3 … x_{t-1})$$，式子中的$$x_t^{'}$$是一个包含$$x_t$$所有可能取值的向量，$$f()$$也会输出一个概率向量，我们挑选其中概率最大的标量，即为最终预测的$$x_t$$。这么看来，<span style="color:red;">序列模型是不是有点像一个softmax模型</span>？虽然叫做“<span style="color:red;">自回归模型</span>”，但是不是看上去<span style="color:red;">更像是一个分类模型</span>？

模型$$f()$$输出值是一个概率向量的特性，反映了“用条件概率表示序列模型”的本质。

将上述序列模型泛化成更一般的情况，当我们要预测序列$$x_1,x_2, … ,x_t$$时，或者是说，我们在已知$$x_1,x_2, … ,x_{t-1}$$要预测xt时，实际上是要找到这样一个序列$$x_1,x_2, … ,x_t$$，使得下述P最大：
\\[
\textit{P}(x_1,...,x_T) = \prod_{t=1}^T \textit{P}(x_t \vert x_{t-1},...,x_1)
\\]
理想的由过去的全部数据预测现在的数据是否太复杂？其实，常用的序列模型有两种，它们都不是由过去全部数据预测现在的数据。
1. 其中一种是基于马尔科夫假设的序列模型，它假设现在的数据$$x_t$$只和过去$$\tau$$个数据相关，语言模型中的n元语法就是一种典型的基于马尔科夫假设的序列模型，很简单，不基于learning，而是基于统计，由于它基于统计，所以它有更好的数学可解释性，能完美地用条件概率$$p(x_1,x_2,x_3) = p(x_1)\times p(x_2 \vert x_1)\times p(x_3\vert x_1,x_2)$$来表达和解释。当然也有基于learning的马尔科夫模型，它很无脑，它只能处理这样的情景：你已知$$(x_1,x_2,x_3)$$，你要预测$$x_4$$，你于是构建这样的model，输入$$x_1,x_2,x_3$$，输出$$x_4$$，数据集你也会搭建，但我感觉它和“条件概率”什么的都没啥关系了，可能一涉及到machine learning，就没什么数学可解释性了吧，你充其量就是说，让model去学习$$x_1,x_2,x_3,x_4$$之间的概率关系。虽然看上去没什么数学可解释性，但我们也常常用条件概率来表示它，$$p(x_4\vert x_1,x_2,x_3)$$表示$$x_4$$和$$x_1,x_2,x_3$$有关，然后model已知$$(x_1,x_2,x_3)$$做分类预测，输出字典中不同可能取值的$$x_4$$的softmax值。
2. 还有一种更高级的就是潜(latent)变量模型(又称隐(hidden)变量)，它假设对于当前数据来说有一个隐变量ht(后序<span style="color:red;">我们常常用state来表示隐变量h，毕竟其实这里的“隐变量”并不是真正严格数学意义上的隐变量，而是hidden state</span>)，该潜变量由上一个数据$$x_{t-1}$$和上一个隐变量$$h_{t-1}$$预测而来，然后当前$$x_t$$由当前隐变量$$h_t$$预测而来，于是通过条件概率表示就有$$y=p(x_t\vert h_t)$$，但在实际应用中，我们预测$$x_t$$有时不仅仅根据$$h_t$$，还会根据$$x_{t-1}$$，图形化表示就是：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-02-Deep-Learning-NLP/序列模型_1.png" alt="序列模型_1" width="50%">
</p>
更准确一点的表示应该是(此时预测$$x_t$$仅根据$$h_t$$)：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-02-Deep-Learning-NLP/序列模型_2.png" alt="序列模型_2" width="60%">
</p>
事实上，隐变量模型是一种广泛的概念，它包括了所有涉及隐状态或潜在变量的模型，而且它更像是一种数学上的概念，上述隐变量模型其实应该是特指的RNN，RNN是一种可以被视作隐变量模型的神经网络模型，但它不能严格地被分为隐变量模型中的某一类，因为严格隐变量模型涉及到很多概率论上的东西，例如$$p(x_t\vert h_t)$$这种形式的条件概率计算，但RNN并没有严格的数学解释，所以<span style="color:red;">RNN</span>只能“被视作一种隐变量模型”。隐马尔科夫模型就能被算作严格的隐变量模型中的一种，它是<span style="color:red;">基于隐变量条件概率$$p(x_t\vert h_t)$$和马尔科夫过程($$\tau$$=1</span>的马尔科夫模型)的，我们这里不多讲。

<br><br>

# (浅层)RNN
RNN就是基于隐变量假设的。它的损失函数叫做“困惑度”，即
\\[
\pi = \frac{1}{n} \sum_{i=1}^n -log\; \textit{p}(x_t\vert x_{t-1},...)
\\]
其中$$p(x_t\vert x_{t-1},…)$$表示model输出的对应groud truth的softmax概率值，-log()是在计算交叉熵，n是指一共输出了长度为n的序列。由于历史原因，我们常常把最终的困惑度取作$$e^{\pi}$$，大概是为了使$$\pi$$更大一点。其实你能看到，$$e^{\pi}$$的结果大致就等于$$p^{-1}$$，所以对于人的理解很直观的就是，当困惑度为1的时候，表示完美预测，当困惑度为2的时候，或许我们可以说，p=1/2，有两个预测值其实都差不多，都可以作为最终的预测值，当困惑度为3的时候，或许我们可以说，p=1/3，有三个预测值其实都差不多，都可以作为最终的预测值，困惑度$$\infty$$就最差了，谁都有可能——这种想法很感性。

RNN是一种隐变量模型，它的网络结构是以隐变量为核心的。这个模型接受两个输入，一个输入时上一个时间步的隐变量h，一个输入时上一个时间步的input x，它的输出就是当前时间步的output o，o在计算的时候只看得到当前时间步的隐变量h。其实不论是隐变量h还是input x还是output o都往往是向量而非标量。

这个模型的参数有param=[Whh、Wxh、Whq、b_h、b_q]，Whh.size=num_hidden*num_hidden，Wxh.size= num_input*num_hidden，Whq.size=num_hidden*num_output，b_q=num_output，b_h=num_hidden。

我们这里举一个具体的具有代表性的，典型的，很有普适性的RNN例子，它大致能做到这样的功能：给定任意时间步长任意批量大小的input，它都能指定生成任意时间步长的output。具体流程是：
1. 先自动生成一个初始化的隐变量h(称为state，state.size=batch_size*num_hidden，要根据input的batch_size自动调整state.size。state的初值在写代码时就给RNN模型固定死了，通常取全为0)
2. 然后先用这些input更新隐变量h，计算h时用的损失函数通常是tanh，所以h的取值往往是(-1,1)，我也不知道为什么，可能是为了数值稳定性和减小模型容量提高泛化性吧。在更新的过程中的output扔掉不管，除了最后一个Input时间步输出的output on
3. 在h更新完成后拿新的h和最后一个input时间步的输出on去预测指定时间步长的output，预测方法是拿上一个时间步的output和h作为当前时间步的RNN的输入，即得到当前时间步的输出o，这是一个自回归的推理过程，自回归体现在上一个时间步的output是当前时间步的input。然后进入下一个时间步，继续上述过程；
4. 再次强调，输入input主要是用来更新隐变量h，在真正预测想要的输出output时，你从输入input推理过程中索取的，只有<span style="color:red;">更新完成的隐变量h</span>和<span style="color:red;">最后一个时间步的输出on</span>。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-02-Deep-Learning-NLP/浅层RNN_1.png" alt="浅层RNN_1" width="60%">
</p>
但其实，不同任务下的不同结构的RNN的很多具体实现细节可以不同，比如说，我一定要保留前期feature输入过程中最后一个时间步得到的output吗？一定要用它作为正式做预测时用的第一个input吗？不一定吧，比如在很多做文本翻译的RNN中，feature输入完后，正式做预测，<span style="color:red;">第一个input是人为设定的vocab.token2item(“\<bos>”)</span>，即一个代表begin-of-sentence的reserved_token。<span style="color:red;">这种情况下</span>，我们就能说，<span style="color:red;">模型对于输入的feature推理得到的output可以全部弃之不用了</span>！很有意思的是，用pytorch搭建的类RNN网络时默认没有output输出的，它们默认自己的输出只有H，你要有output输出，就要自行在输出的最后一层H上搭建一个全连接层。那你说，既然如此，我在真正推理时后期用\<bos>做起始input，那我在前期输入feature时，岂不是可以完全不搭建全连接层，反正由feature得来output也没有作用。这是不对的，因为你不论是train时，还是真实推理时前期输入feature，还是后期循环用上一个时间步的output做当前时间步的input，你用的都是同一个网络，你肯定是要始终保持全连接层的，output丢不丢掉那是另一回事。当然对于有些结构的RNN来说，它的前期feature输入部分和后期预测label部分不是同一个结构(但train部分肯定要用两部分结构的总和)，例如做文本翻译的编码器-解码器结构，这时候，前期输入feature部分你搭建的RNN确实可以干脆不要全连接层算ouput了，后期预测部分你用\<bos>做起始时间步输入即可。

要注意的是，上述RNN在做完一次指定时间步长的infer之后，都会返回该指定时间步长的output以及刚被更新的隐变量h。为什么还要隐变量h呢？这是因为此时的隐变量h保留了已经保存了一开始的input的时序信息和之后所有自回归推理过程中output的时序信息，你可能会需要利用这个时序信息做下一轮指定时间步长的自回归推理。

进一步剖析上述的RNN的结构，你可以发现，假如去掉模型参数Whh，也就是不让模型从上一个时间步长得到隐变量h的信息了，也就是说模型做一次推理不再是自回归了，不再利用上一个时间步长的时序信息了，那么RNN就退化成一个双层感知机，就算你说你RNN做一次时间步的推理还是把上一个时间步的output做了当前时间步的input，但<span style="color:red;">RNN的精髓就在于隐变量的更新，这是其与MLP最大的不同</span>。

上述RNN结构可以用作一个灵活的语言模型，任务就是：给你一段话，你接上下一段话。

首先你要经过文本预处理得到vocab类和取样本迭代器Seqdataloader，训练之前，bacth_size和时间步长T都要固定好，传给Seqdataloader。我们这里假设每一个token都是一个char而非一个word，所以算上空格和\<unk>，一共有28种token。

然后我们在前面早已说过，语言模型归根结底是一个分类模型，所以对于输出而言，我们肯定是输出长为28的向量，代表28中token的概率的评估分数，你看它像不像个独热编码？这个时候对于每个输入输出的token而言，也很自然而然地做成一个长度为28的独热编码了。但假如有些情况下，我们以word而非char为token呢？这样独热编码也太长了吧，而且独热编码有个弊端，best和good的距离与best和bad的距离一样远。于是我们可以<span style="color:red;">在输入token独热编码之后加有一个embedding层</span>，embeding层也是一个可训练的层，它输出embedding编码，它的参数是一个vocab_size*num_embedding的矩阵+bias，vocab_size是独热编码的长度，num_embedding是embedding编码的长度，这相当于一个全连接层，它能压缩原本onehot的维度，而且结果训练之后，它能学习到best编码的距离离good很近。embedding编码的输出再给出去做Wxh得到hidden state。

需要注意的是，训练时，每个epoch是Seqdataloader刚好从corpus中把全部样本取完为止，每个bacth是一个shape为batch_size*T的item编码序列——当然后面要做成独热编码。并且，在train时，有几个input token就该有几个output token，在infer时就不一定了，你只需要给一串任意长度的input，然后指定RNN输出任意长度的output，都行。

训练策略图形化为(图中label1=x2,label2=x3,label3=x4,label4=…)：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-02-Deep-Learning-NLP/浅层RNN_2.png" alt="浅层RNN_2" width="60%">
</p>
我们这里描述的RNN例子(也就是如上图的RNN)要实现的功能是
还要注意的一点是，在pytorch中，输出层要自己定义，我们这里把RNN当语言模型，输入输出的token都是长为28的向量，隐藏层的隐变量h不用说了也是向量，输出层被默认为了Linear层，但在pytorch中，你要自己定义输出层为Linear层，因为pytorch默认的RNN和GRU等都默认输出为state。
<br>

我再继续补充几点。

RNN实际上可以处理任何时序问题，但是它用来处理NLP的情况比较多，所以在很多情况下，当我谈起RNN时，常默认它是一个语言模型，处理文本。

RNN可以粗略分为以下几类：seq2seq、seq2token、token2seq、token2token，对它们分类的标准是按照任务来分的，而非其详细结构或训练方式。其实，这种所谓“按照任务分类”的说法很模糊，你看，我上文对RNN的总体描述，其实是一种具有代表性的，而且是其他一切RNN架构基础的，一个典型实例。我说这个RNN给定任意指定的input和output的时间步长，都能输出相应结果，那么这个RNN，要是我指定不同长度的input和output数据，它是不是就能从上述4大分类中反复横跳？对吧，而且要是我指定时间步长都为1，那岂不就是一个MLP了。

那这么说，我们为什么不干脆就开发一种对输入输出时间步长具备普适性的RNN，或者干脆就不要上述4中分类，以普适的视角看待RNN呢？因为在特定情况下的特定任务中，我们开发的RNN确实是符合seq2seq、seq2token、token2seq、token2token中的某种类型的特征的，而且在这种任务，它是seq2seq就是seq2seq，不大可能因为任务的微小变动而变成token2token。

<br><br>

# NLP中的自编码-自解码器架构：
我在简单介绍后，会举一个例子。

太简单，下图就是介绍：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-02-Deep-Learning-NLP/自编码自解码_1.png" alt="自编码自解码_1" width="45%">
</p>
下面举一个特定任务的seq2seq型RNN的例子。

这是一个做文本翻译的RNN，它将指定长度num_step的英文翻译成指定长度num_step的法文。下图是该模型在valid/test上正式推理时的结构图(注意不是train时的结构图，train时不可能一遇到\<eos>就break)，能看懂大部分这个RNN的结构，但还是有少部分需要额外注明的：
1.	编码器-解码器输入的token都是onehot编码，然后结果embedding层得到embedding编码，然后给出去算hidden state，而hidden state在解码器部分输出的却是onehot编码。
2.	编码器部分完全不用output，但它最后一个时间步得到的hidden state却要完整保留下来，整个H给解码器做初始时间步隐藏状态，hidden state的最后一层H[-1]作为重要的编码结果(事实上，我认为它就是这里就是编码器-解码器结构不同于其他RNN的本质地方，也是它叫做“编/解码”的根本原因。你说编码器不要output，那其他RNN在输入feature时也可以不要FCN算output啊，大不了把预测部分的初始时间步输入设为\<bos>即可)，H[-1]会被拼接到解码器每个时间步的输入部分。我想，H[-1]就是编码器编的码，解码器要解的码。
3.	我们在训练的时候，feature是英文，label是法文，feature在编码器部分输入，label也要参加运算！很有意思吧？训练时，label要作为解码器的输入部分参与运算，输出的token序列再进一步和label做损失函数。这里的损失函数很有意思，下图是模型在valid/test上的结构图，遇到\<eos>就break，但是在train时，可是要满打满算预测完num_step个时间步的token的。假如token序列长度为num_step的label句子的有效长度只有valid_len(例如label为(Jie Chu Shen \<eos> \<pad> \<pad> \<pad>)的num_step=7，valid_len=4)，那我们预测出的长度为num_step的token序列就只掐出来前valid_len的部分(这一步叫mask)，和(Jie Chu Shen \<eos>)做损失函数。
这里的valid_len特指label的valid_len，是在文本预处理中，得到每个feature-label样本token序列的过程算出来的，实际上在文本预处理是还应该算出feature的valid_len，但是这里用不上，feature valid_len只有在引入注意力机制时才用得上。这里直接把整个feature token序列包含\<pad>一并交给编码器-解码器架构的RNN做训练了。
4.	训练时用的损失函数是一种对交 叉熵的扩充，具体我忘了，自己查表。但是它却不太适合用来反映翻译的准确度，因为实际翻译时，谁给做mask？真正翻译时，我们没哟mask，我们预测出\<eos>就break，要么取\<eos>前的token序列做翻译结果，要么取最长长度num_step做预测结果，然后用一种叫做BLEU的评判式子计算与label的匹配度，BLEU式子很看重预测的token序列中和label匹配到的较长的序列：
    <p align="center">
    <img src="{{site.baseurl}}/assets/img/2023-09-02-Deep-Learning-NLP/自编码自解码_2.png" alt="自编码自解码_2" width="50%">
    </p>
    也就是说，我们train时表示误差用的是一种可微的损失函数，valid/test时表示误差用的是一种叫BLEU的评判标准。
5.	编码器-解码器架构远远可以比这里举的例子复杂，例如编码器你完全可以用双向RNN。
6.	还有不懂的，可以看“文本预处理”部分对该处RNN例子的提及。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-02-Deep-Learning-NLP/自编码自解码_3.png" alt="自编码自解码_3" width="100%">
</p>

<br><br>

# GRU：
门控循环单元，Gated Recurrent Unit。

类RNN网络。它是对RNN的改进，引入了<span style="color:red;">门控机制</span>，它有点类似于注意力机制，具体我不多讲。GRU和RNN一样，也是以隐变量$$H$$为核心，输入$$X_{t-1}$$和$$H_{t-1}$$，输出$$Y_t$$。

具体来说，是除了隐变量$$H$$外，还加了个$$R_t$$参数和$$Z_t$$参数。其中$$R$$是reset gate，$$Z$$是update gate，$$\tilde{H}$$是候选隐变量，如下式子($$X_t$$应该写成$$X_{t-1}$$，这里有误)：
\\[
    \displaylines{
R_t=\sigma(X_t W_{xr} + H_{t-1} W_{hr} + b_r) \\\ Z_t=\sigma(X_t W_{xz} + H_{t-1} W_{hz} + b_z) \\\ \tilde{H_t}=tanh(X_t W_{xh} + (R_t \odot H_{t-1} W_{hh} +b_h)) \\\ H_t =Z_t \odot H_{t-1} + (1-Z_t) \odot \tilde{H_t}
    }
\\]
可以看得出来，重置门的作用是选择要不要让当前隐变量少看点儿Xt-1，更新门的作用是选择要不要让当前隐变量多看点Ht-1。

要注意的是，Rt和Zt的激活函数必须是sigmoid，因为sigmoid的输出值是(0,1)，这符合我们对R和Z的语义定义。选择sigmoid当激活函数或许还有一个意外的好处(虽然未经一定线性变换的sigmoid可能不利于在超参数初始化时缓解数值不稳定)，就是它让R和Z的值较小，在反向传播求导时求得的导数也较小，在一定程度上可以说是缓解梯度爆炸吧。

<br><br>

# LSTM：
长短期记忆神经网络是对RNN的改进(GRU是在LSTM之后出来的)。

类RNN网络。LSTM我感觉就是一个RNN多了一个“隐变量”C，当然这里叫记忆单元，它的作用美其名曰“<span style="color:red;">记忆机制</span>”。然后记忆机制的计算就美其名曰“<span style="color:red;">门控机制</span>”。

非常简单：
\\[
\displaylines{
    I_t = \sigma (X_t W_{xi} + H_{t-1} W_{hi} + b_i) \\\ F_t =\sigma (X_t W_{xf} + H_{t-1} W_{hf} + b_f) \\\ O_t =\sigma (X_t W_{xo} + H_{t-1} W_{ho} + b_o) \\\ \tilde{C_t}=tanh(X_t W_{xc} + H_{t-1} W_{hc} + b_c) \\\ C_t=F_t\odot C_{t-1} + I_t \odot \tilde{C_t} \\\ H_t=O_t \odot tanh(C_t)
}
\\]
$$\tilde{C}$$叫做候选记忆单元，I叫做输入门，控制是否要忽略掉输入数据，F叫做忘记门，觉得是否忽略掉上一个时间步的记忆，O叫做输出门，控制输出。

要注意的是，门的取值范围都应该在(0,1)，所以激活函数得用sigmoid，而Ht=Ot*tanh(Ct)，所以H的取值在(-1,1)。C的初始化和H一样，通常全取0。

LSTM把区分C和H有个好处，你有没有看到，我们RNN中的隐变量H好像都是用激活函数tanh算出来的，取值范围都在(-1,1)，而<span style="color:red;">C的取值范围可以随着时间步变得越来越大，它能表征H所不足以表征的更多信息</span>。那为什么H取值要限制在(-1,1)呢？可能是为了数值稳定性和限制模型容量提高泛化性吧，那么C的取值范围为什么可以那么大呢？大概是在反向传播求导C的过程中由于门控机制的存在能保证C的梯度不会太大吧，而且同样由于门控机制的存在导致C不直接参与output的计算，所以模型容量也不会太大吧。那么这么总结说来，<span style="color:red;">LSTM中，引入了以C为代表的记忆机制，是为了存储更多时序信息，而引入了以FIO为代表门控制机制，是为了防止引入C记忆单元顺带来的数值不稳定和模型容量提升</span>吧。当然，<span style="color:red;">门控机制也控制以H的计算</span>。归根结底，<span style="color:red;">记忆单元C都是为了辅助H的计算——H还是类RNN神经网络的核心</span>。

<br><br>

# (深层)RNN：
前面讲的是浅层RNN和基于浅层RNN的GRU和LSTM，浅层RNN实际上就相当于一个两层MLP，就算是多了个记忆单元C的LSTM也不能算是多了一层神经网络，因为对于前面讲的LSTM而言，C和H实际上是处于一个层上。

对于深层RNN而言，其相当于一个n层MLP，$$n\geq 3$$，实现起来也是很简单的，但它模型容量更大，相较于浅层RNN而言引入了更多非线性性。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-02-Deep-Learning-NLP/深层RNN_1.png" alt="深层RNN_1" width="65%">
</p>
对于多层RNN而言，每层RNN都相当于对当前及之前的token序列提取出了特征，其中以hidden state最后一层H[-1]所代表的特征信息量最大，最为重要。所以你能看到H[-1]在做文本翻译RNN中的妙用，以及H[-1]在双向RNN做特征提取器时的妙用。

<br><br>

# 双向RNN：
bidirectional RNN。

双向RNN没办法处理给定一组序列，预测下一组序列的功能，但它可以用来做完形填空或提取文本特征。

双向RNN的本质还是一个以H为核心的RNN，只不过它把H分为了两组，即前向隐变量$$H\to$$和反向隐变量$$H\gets$$，在浅层双向RNN中，$$H\to$$和$$H\gets$$在同一层，它们各自接受前一个时间步$$H\to t-1$$和后一个时间步$$H\gets t+1$$的隐变量信息输入以更新自身，当然，它们都统一接受前一个时间步的input Xt-1的数据输入以更新自身(<span style="color:red;">好像在很多地方，都相关性地统一将Xt-1表示成了Xt</span>，可能是为了不言自明的方便吧)。双向RNN结构如下：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-02-Deep-Learning-NLP/双向RNN_1.png" alt="双向RNN_1" width="40%">
</p>
双向RNN如何训练？你给定一个文本序列“abcdefg”，你要预测abc和efg中间的d ，你训练的时候，先把abc给BRNN，让它更新$$H\to$$和$$H\gets$$，当然此时只有$$H\to$$在为下一个时间步提供信息，然后把efg倒过来，把gfe给BRNN，让它更新$$H\to$$和$$H\gets$$，当然此时只有$$H\gets$$在为上一个时间步提供信息。最后，你那得到的$$H\gets$$和$$H\to$$去预测最终的d。

BRNN的工作模式注定了其不能给定一组input序列然后预测下一组序列，它更适合做完形填空，或者用来抽取一段文本的特征，抽取出来的特征就是中间变量H，是不是和CNN抽取feature map很像？

<br><br>

# 束约束：
上述我们介绍的RNN中，我们默认用了贪心的策略来得到最终预测的模型。这是指：当我们把RNN当做一个语言模型时，我们预测得到的每个时间步理想都是一个token的独热编码，但实际上它是一个softmax概率向量，我们选出这个概率向量中最大的那个作为当前时间步的预测token值，钉死。这是一种贪心的策略，实际上最终得到的结序列果可能不是最优序列：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-02-Deep-Learning-NLP/束约束_1.png" alt="束约束_1" width="70%">
</p>
为了防止贪心的弊端，得到更好的选项，我们可以选择遍历所有可能的序列，但是这样太贵了。

于是我们有了折中方案，束约束，每个时间步保存当前最好的前K个预测token，作为下一个时间步的输入，继续预测，重复上述步骤。最终得到k个token序列，计算哪个序列总概率最大，即是最终结果。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-02-Deep-Learning-NLP/束约束_2.png" alt="束约束_2" width="70%">
</p>

<br><br>

# 文本预处理：
在做nlp模型训练的时候，你肯定不能直接拿自然语言文本来做处理，比如给你一段话，你肯定要用数字对这段话做编码，得到一个tensor后然后拿去做训练。如何编码？我这里提供一个基本pipline，主要包含四步：
1. 下载一个英文.txt文件，把这个文件里的非26个英文字母的字符全部变成空格，然后把全部字母都变成小写。然后，我们做一个列表，这个列表的每个元素也是一个列表，子列表的内容是原文每一行的所有单词字符串，我们暂且管这个二维列表叫做tokens。至于为什么要把txt中的内容做成这样一个二维列表tokens的结构，纯粹是为了后序好处理，你要是高兴，直接把txt的内容做成一维列表tokens也完全没问题啊，你vocabulary类的init函数能处理好这个一维列表的数据类型就行。

    总之，我们这里就当做是你得到一个二维列表tokens了，每一个元素word被称为一个<span style="color:red;">token</span>(nlp中常用术语，译作令牌。但它其实是个通用概念，表示数据的最小单位)——其实这里，你也可以把每个字母当做一个token，这样的话，你最终的元素种类就只有28种了，也行，但是我们一般不这样做，我们一般还是把一个word当做一个token，我们下面按照一个word一个token来处理。

2. 然后你要建立一个vocabulary类，这个类的对象存储一个编码表，编码表逻辑上来说是一个字典，键是token，值是编码item，但为了方便vocabulary类方法的使用，我们在代码实现上还增添了一个列表，列表的每个元素都是token，下标为对应item，主要是为了方便用item去得到token，然后字典方便用token去得到item。故而，这个类具备两个主要方法：token2item传入一个token，返回它的item，常在train时用；item2token传入一个item，返回它的token，常在infer时用。还有另外一个重要的方法：len返回编码表的长度。
   
    如何编码？这一般在vocabulary类的__init__函数中完成，我们给它传入3个参数：tokens二维列表、min_freq、reserved_token。我们先统计tokens中所有独立的单词及其在文本中的出现次数，然后按照它们的出现频次从大到小排序，然后把出现频次小于min_freq的token给剔除掉，剩下的单词加入编码表。但是这些tokens里的单词并不是直接就覆盖掉刚初始化的编码表，而是衔接在编码表的末尾，编码表初始时里面就有内容了，编码表第一个键值对是我们在nlp中常常使用的：”\<unk>”:0，unk是nlp中另一个常用术语，表示未知的word，它的编码是0，因为vacabulary不可能覆盖掉所有可能存在的token，它只存储原本.txt文件中出现频次大于min_freq的word——你总得在vocabulary中预留一个编码应付可能的所有情况，即用”\<unk>”:0来解决。接着”\<unk>”:0，下面的几个键值对也不是tokens中被min_freq筛选出来的token，而是reserved_token，reserved_token代表你人为想要格外关注的token，不管tokens二维列表里有没有出现，你都想把它加入编码表。

    注意，在制作编码表的过程中，有一个中间成员变量self. token_freq，它是一个字典，键是在原txt中出现的token，值是对应token在原txt中出现的频次freq，这个self. token_freq十分有用，能被外界访问。

    综上二点，<span style="color:red;">总的来说，你实现一个编码表类(字典)，编码表包含3块：”\<unk>”:0+reserved_token+被min_freq筛选过的tokens</span>。

    然后<span style="color:red;">你主要从这个class中用3大功能：
    - 用item得到token
    - 用token得到item
    - 通过访问self.token_freq得到每个token在原txt中的出现频次</span>。
    
    (补充一点：为什么我们偏偏要把原始tokens中的token按出现频次从大到小来排序分配item？一方面是为了min_freaq好筛选；另一方面是我们要频繁从vocabulary字典里取token/item，我们把出现频次高的放在相近的一块区域，对计算机性能来说有一定好处。)

3. 这个时候你把txt中的内容tokens传给vocabulary类即<span style="color:red;">得到对象vocab</span>，它能实现item2token()和token2item()两大功能，并提供self.token_freq供外界访问；然后你还要做一件事，就是利用vocab.token2item()将txt中内容tokens全部从字符转换为item编码序列corpus，这里的序列通常应该是一维的，这是你后序要训练语言模型用的<span style="color:red;">文本序列corpus，也可称作语料库</span>。
   
4. 接下来你还要写个迭代器，这个迭代器是用来训练RNN语言模型时用的，相当于一个DataLoader。你在初始化这个迭代器的时候告知它batch_size和每个批次的文本序列的长度(时间步长)T，该迭代器就能每次返回X、Y，它们的shape都是batch_size*T，X和Y都是取自corpus，但X是feature，Y是相对于X滞后一个时间步的label，X-Y即是一个样本。其实DataLoader从corpus中取X有两种取法，corpus不是一个一连串很长的文本item编码序列吗，一种取法是从头到尾，顺序取X，一种是先按照T把corpus分组然后打乱，然后按照被打乱的分组随机从corpus中取X，至于取Y就完全依据X来取了。这两种从corpus中取X-Y的取法是很关键的，它会导致你最终训练RNN时，每个batch训练时要不要先把隐变量h重新初始化，假如迭代器取corpus中的X-Y是顺序取的，那么<span style="color:red;">一个epoch(每轮从迭代器中把corpus中样本全部取完称作一个epoch)</span>只初始化一次h，因为每个batch在训练时可以利用上一个bacth训练结束时留下的隐变量h保存的时序信息，当然你一定一定一定要记住，<span style="color:red;">在一个batch利用上一个batch留下的h来做这一轮bacth的训练时，一定要用detach函数删除掉上一轮h留下的计算图，不然在train时会有很大的求导计算开销</span>。然而，假如迭代器取corpus中的X-Y是乱序随机的，那么每个batch训练时都要重新初始化一遍h，因为上一个bacth的X和这一轮batch的X不是连续的，你用不了人家h保存的时序信息。
   
   其实我觉得，乱序从corpus中取样本时还是乱序取比较好，因为你顺序取，train时每轮batch固然可以利用上一轮batch的时序信息隐变量h，但你在真正用这个RNN的时候，你的场景应该是用户给一个input序列，然后你的RNN生成一个初始化h，然后利用这个h和input，去生成output，这种场景下，你上哪去找所谓“上一轮时序信息h”？你每一次推理都是第一轮，每次推理都得重新初始化隐变量h——诶好像也不一定？不管了，反正我觉得顺序样本和乱序样本两种训练策略中，后者训练出来的RNN泛化能力更好。

   你最终得到的是能做到item2token和token2item的vocab，以及返回feature和label的迭代器，还有vocab的属性——语料库corpus。
<br>

其实上述所说，不过是最基本的文本预处理，面向不同的任务或模型有不同的更复杂的文本预处理的方式，但上述可以说是那些更复杂文本预处理的基础。我下面举一个更复杂的文本预处理方式，它面向的是文本翻译任务，这里举例做文本翻译任务所使用的模型是 seq2seq型的RNN(GRU\LSTM都是类RNN网络)，它很简单，它的任务是将固定长度num_step的英文文本翻译成固定长度num_step的法文文本，以word为token，这样的RNN我在上文总体介绍RNN时有详细解释——所以我们的文本预处理也要面向这样的模型结构+任务。

假如我们有这样一个数据集，数据集的feature是英文，数据集的label是法文，每个feature-label样本是英文一句话，法文一句话，还包含标点符号，所以最后我们的token也要包含标点符号。一句话的长度不一定是num_step。我们要训练一个RNN把英文翻译成法文，我们就要做这样的文本预处理：

首先我们要分别对英文文本和法文文本做一个上述的vocab类vocab_E、vocab_F，构造vocab是传的reserved_token有\<bos>、\<eos>、\<pad>，其中\<eos>代表end-of-sentence，\<pad>代表padding，\<bos>代表begin-of-sentence，前两者主要用在这里的文本预处理，后者主要用在最后的模型推理阶段。然后利用vocab，对于一个样本，我们固定把feature和label分别做成长为num_step的向量，怎么做？我们先将一句话(不论是法文还是英文)用vocab转换为item编码序列，然后给这段话的末尾加上\<eos>的item，然后对这个新的编码序列向量做长为num_step的截断——若是本来这个编码序列长度就不足num_step，那我们就在不足的部分补上\<pad>，反正你模型最后推理的时候会做num_step个时间步推理(看，这里我们就说文本预处理方式面向了模型+任务)，若是某个时间步推理得到了\<eos>，表明翻译结束，下面的时间步直接break就是了；若是这个编码序列长度超过num_step，那就直接截断，你说，把\<eos>截断了，那RNN推理的时候就找不到句子什么时候翻译结束了啊？错了，我说这里的seq2seqRNN固定推理num_step个时间步长。所以说，最后你的feature-label虽然都是长度为num_step的向量，但是其中有效的内容长度valid_len(包括\<eos>)却不一定是num_step，你要做一个分别针对feature和label的向量，分别表示每个样本的valid_len，这个valid_len很重要，因为最后你在这个RNN的模型训练过程中，计算损失函数是，只需要计算长为num_step(用来valid-test的时候遇到推理结果\<eos>立马break，但在训练过程中要老老实实推理num_step个时间步)推理结果序列中的前valid_len的item和对应label前valid_len个item的差异即可。诶，那这么说来，你好像只用到了label的valid_len啊？你是对的，对于这个RNN而言，不用feature的valid_len，只有对于引入注意力机制的RNN，我们才会用到feature的valid_len。

以上，你面向“一个seq2seqRNN对num_step长度的英文翻译成num_step长度的法文”的模型+任务的文本预处理就结束了，你先得到了两个不同的vocab，然后利用这个vocab将将原本的feature-label做成了长度固定为num_step的编码向量，以及附带的feature-label valid_len。你能看出，它是以vocab为基础了，虽然没用到corpus，但是用到了token2item，最后模型推理时也必然用到item2token。

<br><br>

# 语言模型：
语言模型是序列模型的一种，它是用来估计一段文本序列出现的概率。

例如估计文本序列$$x_1,x_2,x_3$$出现的概率，可以这样算：
\\[
p(x_1,x_2,x_3)=p(x_1)\times p(x_2\vert x_1)\times p(x_3\vert x_1,x_2) = \frac{n(x_1)}{n} \times \frac{n(x_1,x_2)}{n(x_1)}\times \frac{n(x_1,x_2,x_3)}{n(x_1,x_2)}
\\]
所以计算$$p(x_1,x_2,x_3)$$时，你只需要统计出给定原始txt中的$$n、n(x_1)、n(x_1,x_2)、n(x_1,x_2,x_3)$$即可，其中$$n$$和$$n(x_i)$$你在文本预处理阶段构造vocabulary类的时候就已经统计过了。小小提一嘴，实际上你估计$$p(x_1,x_2,x_3)$$，你观察上面的通式，实际上你只要知道$$\frac{n(x_1,x_2,x_3)}{n}$$即可了。

但有时候，若是估计一段很长的文本序列的概率$$p(x_1,x_2,…,x_m)$$，由于原txt不够大，你很有可能在原txt中找不到这样一个序列，你就没法估计$$p(x_1,x_2,x_3)=\frac{n(x_1,x_2,x_3)}{n}$$了，怎么办？像是在一般的序列模型中的一样，我们引入马尔科夫假设，假设当前长度token出现的概率只跟过去N-1(即$$\tau$$，我们这里取N为2)个token有关，则
\\[p(x_1,x_2,x_3)=p(x_1)\times p(x_2\vert x_1)\times p(x_3\vert x_1,x_2)=\frac{n(x_1)}{n}\times \frac{n(x_1,x_2)}{n(x_1)}\times \frac{n(x_1,x_2,x_3)}{n(x_1,x_2)}
\\]
可以退化成
\\[p(x_1,x_2,x_3)=p(x_1)\times p(x_2\vert x_1)\times p(x_3\vert x_2)=\frac{n(x_1)}{n}\times \frac{n(x_1,x_2)}{n(x_1)}\times \frac{n(x_2,x_3)}{n(x_2)}
\\]
这样，就算原txt中未出现过序列$$(x_1,x_2,x_3)$$，你也可以估计它出现的概率，只需要统计$$n,n(x_1),n(x_2)，n(x_1,x_2),n(x_2,x_3)$$即可，像上述这种基于马尔科夫假设的语言模型，我们称之为“N元语法”(N-gram，我们这里把N取作了2。若是n取1、2、3就叫uni-gram、bia-gram、tri-gram)。

总结N元语法的实现就是：<span style="color:red;">你要估计任意长度token序列的出现概率，只要token在原txt中出现过，你都能实现，你只需要统计原txt中长度为0到N的所有token序列的出现频次$$n(x_1, … ,x_m)$$即可</span>。

这里再举个二元语法估计$$(x_1,x_2,x_3,x_4)$$出现概率的例子：
\\[
\displaylines{
    \begin{align}
    p(x_1,x_2,x_3,x_4)&=p(x_1)p(x_2\vert x_1)p(x_3\vert x_2)p(x_4\vert x_3)\\\&=\frac{n(x_1)}{n}\frac{n(x_1,x_2)}{n(x_1)}\frac{n(x_2,x_3)}{n(x_2)}\frac{n(x_3,x_4)}{n(x_3)}
    \end{align}
}
\\]
你只需要统计原txt中的n、长度为1的token序列的频次、长度为2的token序列出现的频次即可，即能实现二元语法语言模型。<span style="color:red;">若是你已知了$$x_1,x_2,x_3$$，要预测x4是什么，你只需要看看原文本中哪个word作为$$x_4$$能使得$$n(x_3,x_4)$$最大就行了——这，就是二元语法</span>。顺带提一下，你这里统计长度为2的token的序列出现的频次，实际就相当于把原txt中连续的2个word当做一个token了嘛，你还是可以不加改动地复用文本预处理阶段就准备好了的vocabulary类，然后它就能帮你统计好长度为2的token的出现频次了嘛。

上述这种N元语法语言模型不是基于learning的，它基于统计，它也是马尔科夫序列模型的一种。其实，n-gram的概念有时还可以泛化为关注长度为n的序列的文本预测模型，而不仅限于这里$$\tau=n-1$$的马尔科夫假设的统计语言模型，例如在机器翻译模型中，BLEU中的$$p_n$$项就是衡量预测结果中长度为n的序列的命中率

当然也有基于learning的马尔科夫模型，它不能处理预测整个$$(x_1,x_2,x_3,x_4)$$的出现概率，它只能处理已知$$(x_1,x_2,x_3)$$预测x4的功能，它就没什么“条件概率”的数学可解释性了，充其量是让model去学习$$x_1,x_2,x_3,x_4$$之间的概率关系。

<br><br>

# 注意力机制：
\\[
    f(Q, (K, V))=\alpha( a( K, Q ) ) \times V
\\]
Q叫做query，K和V是键值对。$$\alpha$$算出来的是注意力权重，通常$$\alpha$$是softmax函数，a算出来的是注意力分数。最原始的a是统计学家做的，他们的a是计算一条q和已知的每一条$$k_i$$的相似度，比如：$$-\frac{1}{2} \times (q-k_i)^2$$。

通常a算出来的就是一个向量，K有多长，该向量就有多长，然后对这个向量做softmax函数变换嘛。

注意力机制可以用在编码器-解码器架构的sep2seq任务上：编码器每一个时间步的H[-1]:H[-1]现成键值对K:V，然后解码器每一步输入啊，不是H[-1]和embedding(x)拼接在一起了，而是上一个时间步的H[-1]做f( H[-1], (K, V) )得到的值，和embedding(x)拼合在一起再输入。架构如下：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-02-Deep-Learning-NLP/注意力机制_1.png" alt="注意力机制_1" width="60%">
</p>

<br><br>

# 自注意力机制：
Q,K,V是一个东西，主要是用来抽取时序序列的特征。

我们在描述自注意力机制对模型的input时，通常表示其维度为batch*len*dim，len是一个序列的长度(每个序列可以作为一个样本，len即特征数，像是图片中的通道一样)，dim是表示序列中每个token的向量。一组输入中，batch和dim是固定的，但len往往不一样，我们视情况处理len不一样造成的困扰，例如将len和batch合并为一个维度等等。

它的好处是：视野广(看到序列全局信息所需的“最长路径”短)，并行计算度好。

下面是它和CNN、RNN处理时序序列的对比：
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-02-Deep-Learning-NLP/自注意力机制_1.png" alt="自注意力机制_1" width="95%">
</p>
自注意力机制的缺点是：算起来贵；不能记录位置/时序信息。

不能记录位置信息的意思是：把input的序列打乱后，对output的值无影响。你看CNN和RNN若是把input的顺序打乱后，output的值就会变化了，这就是CNN和RNN模型本身能记录位置信息。

但是不能记录位置信息的缺点已经被解决了，因为虽然我们无法改变模型本身的性质，但是我们可以改变input的性质：我们给input加上了位置编码。位置编码可以是可学习的，但我们一般用不可学习的，效果也不错，如下：

### 位置编码
- 跟CNN/RNN不同，自注意力并没有记录位置信息
- 位置编码将位置信息注入到输入里
  - 假设长度为n的序列是$$\textbf{X}\in \mathbb{R}^{n\times b}$$,那么使用位置编码矩阵$$\textbf{P}\in \mathbb{R}^{n\times d}$$来输出$$\textbf{X}+\textbf{P}$$作为自编码输入
- $$\textbf{P}$$的元素如下计算：
\\[
p_{i,2j}=sin\left( \frac{i}{10000^{2j/d}} \right),\quad p_{i,2j+1}=cos\left( \frac{i}{10000^{2j/d}} \right)
\\]

### 位置编码矩阵
- $$\textbf{P}\in \mathbb{R}^{n\times d}:\quad p_{i,2j}=sin\left( \frac{i}{10000^{2j/d}} \right),\quad p_{i,2j+1}=cos\left( \frac{i}{10000^{2j/d}} \right)$$
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-02-Deep-Learning-NLP/自注意力机制_2.png" alt="自注意力机制_2" width="70%">
</p>
“位置编码”设计者对它的期许是：模型能够自动学习到input序列中的输入信息。

位置编码计算公式中我们为什么要使用sin-cos？因为我们希望位置编码记录的位置信息是两个token之间的相对位置信息，而非绝对位置信息(有时候序列太长了，绝对位置信息没有意义)，我们期望模型能学到相对位置信息，而sin-cos模式的位置编码就能记录相对位置信息，这能通过下面的公式体现：
- 位置于$$i+\delta$$处的位置编码可以线性投影位置$$i$$处的位置编码来表示
- 记$$w_j=1/10000^{2j/d}$$，那么
    \\[
    \displaylines{
        \begin{bmatrix}
        cos(\delta w_j)&sin(\delta w_j)\\\ -sin(\delta w_j)&cos(\delta w_j)
        \end{bmatrix}
        \begin{bmatrix}
        p_{i,2j}\\\p_{i,2j+1}
        \end{bmatrix}
        =
        \begin{bmatrix}
        p_{i+\delta,2j}\\\p_{i+\delta,2j+1}
        \end{bmatrix}
    }
    \\]
自注意力机制是transformer的核心，transformer也是一个编码器解码器架构，但是它的编码器是直接将整个时序序列编码(不同于RNN)，然后在predict时一个时间步一个时间步地像RNN一样地预测(在train时则像普通的编码器-解码器架构的seq2seq一样训练)。

transformer的结构中有一个很重要的Norm层，但它不是Batch Norm层，而是Layer Norm层，BN处理的事batch维，但LN处理的是特征维。LN和BN都是通过计算出的均值和方差来加入噪音，但是LN用得比较多，特别是在NLP领域。LN的优点有：
1. BN处理小batch的输入效果不好，噪音太大了
2. LN能处理一个batch中各样本len不同的情况
3. 被normalization的元素处于同一个语义空间中。
<p align="center">
<img src="{{site.baseurl}}/assets/img/2023-09-02-Deep-Learning-NLP/自注意力机制_3.png" alt="自注意力机制_3" width="50%">
</p>

<br><br>

# Bert
Bert就是个只剩下encoder的transformer，它是一个功能类似于resnet的预训练模型。

Bert的预训练任务一般是“完形填空”+“判断两句连续”的联合训练，在做预训练任务时，肯定是要在encoder上新增MLP的。

在用Bert的encoder做微调时，一般也是在encoder上加MLP。
