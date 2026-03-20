"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  X,
  MapPin,
  Flame,
  Trophy,
  Rocket,
  GraduationCap,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

const avatarColors = [
  "#F5A623", "#6366F1", "#10B981", "#EF4444", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F59E0B", "#3B82F6", "#22C55E",
  "#E11D48", "#7C3AED", "#06B6D4", "#D946EF", "#84CC16",
  "#F97316", "#0EA5E9", "#A855F7", "#EAB308",
];

interface Student {
  name: string;
  city: string;
  classYear: string;
  bio: string;
  project: string;
  streak: number;
  rank: number;
  online: boolean;
}

const students: Student[] = [
  { name: "Riya Sharma", city: "Mumbai", classYear: "Class 11", bio: "Passionate about AI and design. Building tools that help students learn better.", project: "StudyBuddy AI", streak: 21, rank: 1, online: true },
  { name: "Karthik Nair", city: "Bangalore", classYear: "Class 12", bio: "Full-stack enthusiast. Love building apps that solve real problems.", project: "EcoTrack", streak: 18, rank: 2, online: true },
  { name: "Arjun Mehta", city: "Delhi", classYear: "Class 11", bio: "Curious builder exploring the intersection of AI and education.", project: "QuizMaster Pro", streak: 14, rank: 3, online: false },
  { name: "Sneha Reddy", city: "Hyderabad", classYear: "Class 10", bio: "Aspiring data scientist. Love working with Python and ML models.", project: "HealthPulse", streak: 12, rank: 4, online: true },
  { name: "Aditya Patel", city: "Ahmedabad", classYear: "Class 12", bio: "Building for the future of e-commerce in India.", project: "ShopLocal", streak: 16, rank: 5, online: false },
  { name: "Priya Gupta", city: "Jaipur", classYear: "Class 11", bio: "Creative coder who loves making beautiful and functional UIs.", project: "ArtBoard AI", streak: 10, rank: 6, online: true },
  { name: "Rohan Das", city: "Kolkata", classYear: "Class 12", bio: "Backend wizard. Fascinated by distributed systems and APIs.", project: "ChatFlow", streak: 9, rank: 7, online: false },
  { name: "Ananya Iyer", city: "Chennai", classYear: "Class 11", bio: "Passionate about education tech and making learning accessible.", project: "LangBridge", streak: 7, rank: 8, online: true },
  { name: "Vikram Singh", city: "Lucknow", classYear: "Class 10", bio: "Game developer turned web developer. Love interactive experiences.", project: "MathQuest", streak: 11, rank: 9, online: false },
  { name: "Meera Joshi", city: "Pune", classYear: "Class 12", bio: "Sustainability advocate building tech for a greener planet.", project: "GreenTrail", streak: 8, rank: 10, online: true },
  { name: "Siddharth Kumar", city: "Chandigarh", classYear: "Class 11", bio: "Music meets code. Building AI-powered audio tools.", project: "BeatCraft AI", streak: 6, rank: 11, online: false },
  { name: "Kavya Menon", city: "Kochi", classYear: "Class 10", bio: "Avid reader and writer. Working on AI-assisted storytelling.", project: "StoryWeaver", streak: 5, rank: 12, online: true },
  { name: "Rahul Verma", city: "Indore", classYear: "Class 12", bio: "Fitness enthusiast building health-tech solutions.", project: "FitLog", streak: 4, rank: 13, online: false },
  { name: "Ishaan Bhat", city: "Mangalore", classYear: "Class 11", bio: "Exploring the world of APIs and microservices.", project: "None yet", streak: 3, rank: 14, online: false },
  { name: "Tanya Kapoor", city: "Noida", classYear: "Class 10", bio: "Design-first developer. Obsessed with pixel-perfect UI.", project: "None yet", streak: 2, rank: 15, online: true },
  { name: "Aarav Deshmukh", city: "Nagpur", classYear: "Class 11", bio: "Robotics club lead, now diving into web dev.", project: "RoboGuide", streak: 7, rank: 16, online: false },
  { name: "Nisha Pillai", city: "Trivandrum", classYear: "Class 12", bio: "Competitive programmer exploring product development.", project: "CodePair", streak: 10, rank: 17, online: true },
  { name: "Dev Saxena", city: "Bhopal", classYear: "Class 11", bio: "Curious about everything from ML to mobile apps.", project: "WeatherWise", streak: 5, rank: 18, online: false },
];

export default function CohortPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-indigo/10 flex items-center justify-center">
          <Users className="h-6 w-6 text-indigo" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            Cohort 1 &middot; 25 Builders &middot; Started Jan 2025
          </h1>
          <p className="text-sm text-text-muted">
            Meet your fellow builders in the program
          </p>
        </div>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {students.map((student, index) => (
          <motion.div
            key={student.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card
              className="cursor-pointer hover:border-amber/40 transition-all duration-200 hover:shadow-[0_0_20px_rgba(245,166,35,0.06)]"
              onClick={() => setSelectedStudent(student)}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar
                    name={student.name}
                    size="md"
                    color={avatarColors[index % avatarColors.length]}
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background-card ${
                      student.online ? "bg-success" : "bg-white/20"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-text-primary truncate">
                    {student.name}
                  </h3>
                  <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {student.city}
                  </p>
                  {student.project !== "None yet" && (
                    <p className="text-xs text-indigo mt-1.5 truncate flex items-center gap-1">
                      <Rocket className="h-3 w-3 shrink-0" />
                      {student.project}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedStudent(null)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-background-card border-l border-border z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Close button */}
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-semibold text-text-primary">
                    Student Profile
                  </h2>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <X className="h-4 w-4 text-text-muted" />
                  </button>
                </div>

                {/* Profile header */}
                <div className="flex items-center gap-4">
                  <Avatar
                    name={selectedStudent.name}
                    size="lg"
                    color={
                      avatarColors[
                        students.findIndex(
                          (s) => s.name === selectedStudent.name
                        ) % avatarColors.length
                      ]
                    }
                  />
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-sm text-text-muted flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {selectedStudent.city}
                    </p>
                  </div>
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-white/[0.03] border border-border p-3 text-center">
                    <Flame className="h-4 w-4 text-amber mx-auto mb-1" />
                    <p className="text-lg font-bold text-text-primary">
                      {selectedStudent.streak}d
                    </p>
                    <p className="text-xs text-text-muted">Streak</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] border border-border p-3 text-center">
                    <Trophy className="h-4 w-4 text-amber mx-auto mb-1" />
                    <p className="text-lg font-bold text-text-primary">
                      #{selectedStudent.rank}
                    </p>
                    <p className="text-xs text-text-muted">Rank</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] border border-border p-3 text-center">
                    <GraduationCap className="h-4 w-4 text-indigo mx-auto mb-1" />
                    <p className="text-sm font-bold text-text-primary">
                      {selectedStudent.classYear.replace("Class ", "")}
                    </p>
                    <p className="text-xs text-text-muted">Class</p>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-text-muted uppercase tracking-wider">
                    About
                  </h4>
                  <p className="text-sm text-text-primary leading-relaxed">
                    {selectedStudent.bio}
                  </p>
                </div>

                {/* Active Project */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-text-muted uppercase tracking-wider">
                    Active Project
                  </h4>
                  <div className="rounded-lg bg-white/[0.03] border border-border p-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo/10 flex items-center justify-center shrink-0">
                      <Rocket className="h-4 w-4 text-indigo" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {selectedStudent.project}
                      </p>
                      <p className="text-xs text-text-muted">
                        {selectedStudent.project !== "None yet"
                          ? "In progress"
                          : "Not started"}
                      </p>
                    </div>
                    {selectedStudent.project !== "None yet" && (
                      <Badge variant="success" className="ml-auto">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 pt-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      selectedStudent.online ? "bg-success" : "bg-white/20"
                    }`}
                  />
                  <span className="text-sm text-text-muted">
                    {selectedStudent.online
                      ? "Online now"
                      : "Offline"}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
