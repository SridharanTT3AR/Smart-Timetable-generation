class Lab:
    def __init__(self, Lbuilding, Lid):
        self.Lbuilding = Lbuilding
        self.Lid = Lid
        self.slotfree = self.initialize()
        self.slotfixed = []
        return

    def initialize(self):
        slots = []
        for i in range(1, 31):
            slots.append(i)
        return slots

    def laballocation(self, course, slot_number):
        return

    def handleclash(self):
        return
