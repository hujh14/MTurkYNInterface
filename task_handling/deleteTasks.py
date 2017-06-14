import os

def deleteTasks():
    tasks_folder = "../tasks"
    for filename in os.listdir(tasks_folder):
        if ".json" in filename:
            if not "example" in filename:
                os.remove(os.path.join(tasks_folder, filename))

deleteTasks()