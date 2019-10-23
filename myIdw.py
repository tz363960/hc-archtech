import numpy as np
import sys, time, datetime


np.set_printoptions(threshold=np.inf)
# 返回经反距离插值法的值
def myIDW(a, b, pi, yjz):
    reArray = yjz.reshape(-1)
    k = np.alen(pi[1])  # 矩阵长度
    ptn = []
    for ii in range(k):
        dis = np.sqrt((a - pi[0][ii]) * (a - pi[0][ii]) + (b - pi[1][ii]) * (b - pi[1][ii]))
        ptn.append(dis)
    ptn = np.array(ptn)     # 此处是插入点离另外输入的16个点的距离
    ptn = (1/ptn)/np.sum(1/ptn) # 此处是权重
    ptn = np.where(ptn>np.max(ptn)*0.9, ptn, 0)
    aInterpolation = sum(np.multiply(ptn, reArray))
    return aInterpolation


def IDWFinal():
    testArray = np.array([[8, 10], [10, 9]])
    finalArray = np.zeros((200, 200))   # 待扩充矩阵
    fLength, fHigh = finalArray.shape
    tLength, tHigh = testArray.shape
    arraySpace = int(fLength / (tLength + 1))
    for i in range(tLength):
        for j in range(tHigh):
            finalArray[(i + 1) * arraySpace, (j + 1) * arraySpace] = testArray[i, j]

    fIndex = np.nonzero(finalArray)  # 输入点的下标，按行来，从上到下
    for i in range(fLength):
        for j in range(fHigh):
            if finalArray[i, j] == 0:
                finalArray[i, j] = myIDW(i, j, fIndex, testArray)
    finalHSL = (finalArray-np.min(finalArray))/(np.max(finalArray)-np.min(finalArray))
    finalHSL = 1 - finalHSL
    finalHSL = finalHSL * 0.667
    return finalArray, finalHSL


testInfo = {}
wantArray, wantHSL = IDWFinal()
aa = wantHSL.reshape(-1)    # 转成行向量
aa = np.around(aa, 2)   # numpy取两位小数
aa = aa.tolist()    # numpy的转list方法
aa = str(aa)    # 转的是这种格式："[1,1,1,1,...1]"
print(aa) # 对于Python脚本里的打印语句都会重定向到Nodejs脚本中