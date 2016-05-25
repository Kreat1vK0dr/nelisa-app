#!/usr/bin/Rscript
# ENABLE command line arguments
args <- commandArgs(trailingOnly=TRUE)

x <- matrix(1:10, ncol = 5)
x
write(t(x), "./data/test.txt", sep=",")
write.csv(x, "./data/test.csv", sep=",")
commandArgs()
print("Hello R")

name <- args[1]
name

write(name, "./data/name.txt");
