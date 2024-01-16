---
layout: post
title: "EHOI : A Dataset"
date: 2023-08-19 01:39:00 +0300
description: \"EHOI\" stands for Event-based Hand-Object Interaction reconstruction. As the name suggests, this refers to a dataset used in an event stream modality, aimed at the task of 3D reconstruction of hand-object interactions. # Add post description (optional)
img: 2023-08-19-EHOI-A-Dataset/demo.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [Event Stream, Hand-Object Interaction, 3D Reconstruction]
comments: true
---

"EHOI" stands for Event-based Hand-Object Interaction reconstruction. 

<!-- more -->
<br><br>

# Motivation
As the name suggests, EHOI is a dataset designed for the 3D reconstruction of hand-object interactions using an event stream modality. This dataset represents a significant step in the realm of event-based 3D reconstruction.

This dataset was inspired by my role in leading a research initiative focused on setting a benchmark for event-based 3D reconstruction in this field. Throughout this project, we faced numerous challenges. These obstacles proved to be disheartening my progress, ultimately resulting in the decision to discontinue the project. 

Despite this setback, the intermediate outcome of our efforts, the EHOI dataset, remains as a testament to our work and is now available for access.

If you are interested in the EHOI dataset, please feel free to email me. 

Open-source release on arXiv will come soon ...

<br><br>

# Dataset Creation
Given the complexities involved in annotating hand-object 3D reconstructions in event stream modality, we decided to utilize a transcription tool to convert sequences from existing RGB datasets into event streams.

Therefore, we selected two RGB datasets for this purpose: [DexYCB](https://dex-ycb.github.io/) and [HO3D](https://www.tugraz.at/institute/icg/research/team-lepetit/research-projects/hand-object-3d-pose-annotation/), chosen for their diverse contexts, substantial size, and high-quality annotations.

The transcription tool we used is [v2e (CVPRW2021)](https://arxiv.org/abs/2006.07722), which employs a technique involving Frame Interpolation, Luminance Difference, and Noise Simulation.

We transformed DexYCB into E-DexYCB and HO3D into E-HO3D. After combining them, we created the EHOI dataset. For each sample in the RGB modality, we generated three event streams using v2e's noise simulation feature, each with different noise levels: ideal (no noise), bright (minimal noise), and dark background (substantial noise). As a result, our EHOI dataset consists of 3000 sequences (3 times the number in DexYCB) plus 204 sequences (3 times those in HO3D).<br>
For more details on the specific contexts, frame numbers, and resolutions of these sequences, refer to the original datasets: [DexYCB](https://dex-ycb.github.io/assets/chao_cvpr2021.pdf) and [HO3D](https://arxiv.org/pdf/1907.01481.pdf).

To our best knowledge, <strong> EHOI is the largest event stream dataset in the community for hand-object interaction 3D reconstruction tasks </strong>.

Below is the transcription script we used, which includes the configurations we adopted:

```python
import argparse
import os
import glob
import subprocess
import random
import json
import shutil

parser = argparse.ArgumentParser()
parser.add_argument("--dataset_config", type=str,
                    help="'ideal', 'bright', 'dark'")

data_root="/root/autodl-tmp/dex-ycb-20210415/"
output_root=data_root

# set configs
dataset_config=args.dataset_config
if not os.path.exists(output_root):
    os.makedirs(output_root)
if dataset_config == "ideal":
    thre_low, thre_high = 0.05, 0.5
    sigma_low, sigma_high = 0, 0
    cutoff_hz_low, cutoff_hz_high = 0, 0
    leak_rate_hz_low, leak_rate_hz_high = 0, 0
    shot_noise_rate_hz_low, shot_noise_rate_hz_high = 0, 0
elif dataset_config == "bright":
    thre_low, thre_high = 0.05, 0.5
    sigma_low, sigma_high = 0.03, 0.05
    cutoff_hz_low, cutoff_hz_high = 200, 200
    leak_rate_hz_low, leak_rate_hz_high = 0.1, 0.5
    shot_noise_rate_hz_low, shot_noise_rate_hz_high = 0, 0
elif dataset_config == "dark":
    thre_low, thre_high = 0.05, 0.5
    sigma_low, sigma_high = 0.03, 0.05
    cutoff_hz_low, cutoff_hz_high = 10, 100
    leak_rate_hz_low, leak_rate_hz_high = 0, 0
    shot_noise_rate_hz_low, shot_noise_rate_hz_high = 1, 10
    
    
valid_folders=glob.glob(os.path.join(data_root,"*-subject-*/*/*/"))

params_collector = {}
stats_record=open(os.path.join(output_root,"stats_record_"+dataset_config+".txt"), "w")

for folder in valid_folders:
    out_filename = folder.split('/')[-2]+".h5"
    out_folder = os.path.join(folder,"event_"+dataset_config)

    #看看该样本是否此前已经生成了事件流
    if not os.path.exists(os.path.join(out_folder,out_filename)):
        stats_record.seek(0)
        stats_record.write(out_folder+out_filename+"creating...                    /n")
    else:
        continue

    # configure paramters
    thres = random.uniform(thre_low, thre_high)
    # sigma should be about 15%~25% range as low and high
    # threshold higher than 0.2: 0.03-0.05
    # threshold lower than 0.2: 15%~25%
    #  sigma = random.uniform(sigma_low, sigma_high)
    sigma = random.uniform(
        min(thres*0.15, sigma_low), min(thres*0.25, sigma_high)) \
        if dataset_config != "ideal" else 0

    leak_rate_hz = random.uniform(leak_rate_hz_low, leak_rate_hz_high)
    shot_noise_rate_hz = random.uniform(
        shot_noise_rate_hz_low, shot_noise_rate_hz_high)

    if dataset_config == "dark":
        # cutoff hz follows shot noise config
        cutoff_hz = shot_noise_rate_hz*10
    else:
        cutoff_hz = random.uniform(cutoff_hz_low, cutoff_hz_high)

    params_collector[os.path.join(out_folder, out_filename)] = {
        "thres": thres,
        "sigma": sigma,
        "cutoff_hz": cutoff_hz,
        "leak_rate_hz": leak_rate_hz,
        "shot_noise_rate_hz": shot_noise_rate_hz}

    # dump bias configs all the time
    with open(os.path.join(output_root,"dvs_params_settings_"+dataset_config+".json"), "w") as f:
        json.dump(params_collector, f, indent=4)
    # # 这是当翻录终端要重新翻录时使用的代码：
    # # 首先，打开并读取文件
    # with open(os.path.join(output_root, "dvs_params_settings.json"), "r") as f:
    #     data = json.load(f)
    # # 然后，更新数据
    # data.update(params_collector)
    # # 最后，写入新的数据
    # with open(os.path.join(output_root, "dvs_params_settings.json"), "w") as f:
    #     json.dump(data, f, indent=4)

    #让输出的frame是源文件夹中的.jpg文件，取出.npz标注文件和.png深度图像文件的影响
    tmp_folder=os.path.join("/root/autodl-tmp/tmp_folder_"+dataset_config,folder.split("dex-ycb-20210415/")[-1])
    shutil.copytree(folder, tmp_folder)
    for file in os.listdir(tmp_folder):
        if ".jpg" not in file:
            rm_path=os.path.join(tmp_folder,file)
            if os.path.isfile(rm_path):
                os.remove(rm_path)
            else:
                shutil.rmtree(rm_path)
    v2e_command = [
        "python",
        "v2e.py",
        "-i", tmp_folder,
        "-o", out_folder,
        "--overwrite",
        "--unique_output_folder", "false",
        "--davis_output",
        "--dvs_h5",out_filename,
        "--dvs_aedat2","None",
        "--dvs_text","None",
        "--no_preview",
        "--dvs_exposure", "duration", "0.033",
        "--skip_video_output",
        "--input_frame_rate", "30",
        "--input_slowmotion_factor", "1",
        "--slomo_model","/root/autodl-tmp/v2e/input/SuperSloMo39.ckpt",
        "--auto_timestamp_resolution", "true",
        "--pos_thres", "{}".format(thres),
        "--neg_thres", "{}".format(thres),
        "--sigma_thres", "{}".format(sigma),
        "--cutoff_hz", "{}".format(cutoff_hz),
        "--leak_rate_hz", "{}".format(leak_rate_hz),
        "--shot_noise_rate_hz", "{}".format(shot_noise_rate_hz),
        "--dvs640"
        ]
        
    print("\n\n\n********************************************")
    print("input folder:",tmp_folder)
    print("output folder:", out_folder)
    print("output file:", out_filename)
    print("********************************************\n")
    subprocess.run(v2e_command)
    shutil.rmtree(tmp_folder)
    stats_record.seek(0)
    stats_record.write(out_folder+out_filename+"created successfully.              /n")

stats_record.close()
```

<br><br>

# Demo
Here are some sample demonstrations:
- Original gray video :
<video width="60%" controls>
  <source src="{{site.baseurl}}/assets/img/2023-08-19-EHOI-A-Dataset/original_Gray_video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

- Frame interpolation result using v2e :
<video width="60%" controls>
  <source src="{{site.baseurl}}/assets/img/2023-08-19-EHOI-A-Dataset/Gray_video_with_frame_interpolation.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

- Translated sequence using v2e with ideal noise level :
<video width="60%" controls>
  <source src="{{site.baseurl}}/assets/img/2023-08-19-EHOI-A-Dataset/dvs-video_ideal.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

- Translated sequence using v2e with bright background :
<video width="60%" controls>
  <source src="{{site.baseurl}}/assets/img/2023-08-19-EHOI-A-Dataset/dvs-video_bright.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

- Translated sequence using v2e with dark background :
<video width="60%" controls>
  <source src="{{site.baseurl}}/assets/img/2023-08-19-EHOI-A-Dataset/dvs-video_dark.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

- An event stream captured in reality using the DAVIS346, featuring a context similar to the samples above, serves as a reference.
  Note: The resolution of this real sequence is 346x260, whereas the resolution of the transcribed sequences above is 640x480.
<video width="60%" controls>
  <source src="{{site.baseurl}}/assets/img/2023-08-19-EHOI-A-Dataset/real_video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>