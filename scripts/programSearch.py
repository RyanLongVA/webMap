#!/usr/bin/env python 
import os, sys, sqlite3, pdb, subprocess
from timeout import timeout
from sqlite3 import Error

# not sure how nodejs is going to take the path

def create_dbConnection():
    try:
        # trying to create a connection with the proceeding connection
        a = sqlite3.connect('./../test.db')
        return a
    except Error as e:
        print(e)
    return None

def select_webAppFromPrograms(conn):
    cur = conn.cursor()
    cProgram = sys.argv[1]
    statem = "SELECT \"Live WebApp Scope\" FROM programs WHERE name =\'%s\'" % cProgram
    cur.execute(statem)
    rows = cur.fetchone()
    a = str(rows[0]).split(' , ')
    return a

def checkLiveWebApp(conn, tableName):
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=\'"+tableName+"\'")
    if cur.fetchone():
        return True
    else:
        cur.execute("CREATE TABLE IF NOT EXISTS "+tableName+"(Domain TEXT, \"Research Only\" TEXT, DNS TEXT, Endpoints TEXT, NS TEXT, Ports TEXT, BuiltWith TEXT, \"Content-Security-Policy\" TEXT, \"X-Frame-Options\" TEXT, \"X-Xss-Protection\" TEXT, \"X-Content-Type-Options\" TEXT)")
    # Seems tables are automatically saved 

def checkLiveWebApp_Domains(conn, tableName, domainArray):
    for a in domainArray:
        cur = conn.cursor()
        statem = "SELECT * FROM "+tableName+" WHERE Domain=\'"+a+"\'"
        cur.execute(statem)
        if cur.fetchone():
            next
        else:
            print "[+] ",tableName,":",a,"-- Added"
            cur.execute("INSERT OR IGNORE INTO \""+tableName+"\"(Domain) VALUES ('%s')"%a)
    conn.commit()

def soleDomainAdd(conn, tableName, a):
    cur = conn.cursor()
    statem = "SELECT * FROM "+tableName+" WHERE Domain=\'"+a+"\'"
    cur.execute(statem)
    if cur.fetchone():
        return
    else:
        print "[+] ",tableName,":",a,"-- Added"
        cur.execute("INSERT OR IGNORE INTO \""+tableName+"\"(Domain) VALUES ('%s')"%a)
    conn.commit()

def cleanBrutesubs():
    try:
        subprocess.call('rm -d -r ~/arsenal/recon/brutesubs/myoutdir/*', err=p.communicate(), shell=True)
    except:
        pass

@timeout(1000)
def callBrutesubs(a):
    subprocess.call("cd ~/arsenal/recon/brutesubs && sh ./brutesubs.sh "+a+" %s_output "%a, shell=True)
    test = subprocess.check_output('cat ~/arsenal/recon/brutesubs/myoutdir/'+a+'_output.txt', shell=True)
    test =filter(None, test.split('\n'))
    return test


def main():
    conn = create_dbConnection()

    # connection action block
    cScope = select_webAppFromPrograms(conn)
    # Does {Program}_liveWebApp exist
    checkLiveWebApp(conn, sys.argv[1]+'_liveWebApp')
    for a in cScope:
        cleanBrutesubs()
        try:
            if (a[:2] == '*.'):
                a = a[2:]
                b = callBrutesubs(a)
                checkLiveWebApp_Domains(conn, sys.argv[1]+'_liveWebApp', b)
            else:
                soleDomainAdd(conn, sys.argv[1]+'_liveWebApp', a)
                pdb.set_trace()
        except Exception, e:
            print '[-]',a,'something went wrong:',e
            exit()

if __name__=='__main__':
    main()
