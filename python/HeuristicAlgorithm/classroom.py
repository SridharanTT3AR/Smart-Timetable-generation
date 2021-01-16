class Classroom:
    def __init__(self,Crbuilding,Crid):
        self.Crbuilding = Crbuilding
        self.Crid = Crid
        self.slotfree = self.initialize()
        self.slotfixed = []

    def initialize(self):
        slots = []
        for i in range(1,31):
            slots.append(i)
        return slots

    def classroomallocation(self):
        return


    def handleclash(self):
        return
