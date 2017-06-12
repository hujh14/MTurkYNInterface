import os
import sys
import json
import uuid

'''
Create task specifications.
'''

def getImagePaths(folder):
    if os.path.isdir(folder):
        images = []
        for f in os.listdir(folder):
            if os.path.splitext(f)[1] == ".jpg" or os.path.splitext(f)[1] == ".png":
                images.append(os.path.join(folder,f))
        return images
    else:
        return []

def createBatches(images):
    batches = [images[i:i+maxTaskSize] for i in xrange(0, len(images), maxTaskSize)]
    n = len(batches)
    if n == 1:
        return batches

    if len(batches[n-1]) < len(batches[n-2])/2:
        merge = batches[n-2] + batches[n-1]
        batches[n-2] = merge[:len(merge)/2]
        batches[n-1] = merge[len(merge)/2:]
    return batches


question = "Is this a bad annnotation?"
clarification = "A bad annotation is where the highlighted region incorrectly segments a region."
folder = os.path.abspath(sys.argv[1])
images = getImagePaths(folder)

if len(images) == 0:
    raise Exception("Cannot create task for zero images.")

maxTaskSize = 100
batches = createBatches(images)

for batch in batches:
    data = {}
    data["question"] = question
    data["clarification"] = clarification
    data["images"] = batch
    data["num_of_images"] = len(batch)

    task_id = uuid.uuid4().hex
    task_file = "../tasks/{}.json".format(task_id)
    with open(task_file, 'w') as outfile:
        json.dump(data, outfile, indent=2)
    print "Created task {} with {} images".format(task_id, len(batch))

