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

def select_webAppScope(conn):
    cur = conn.cursor()
    cProgram = sys.argv[1]
    statem = "SELECT \"Live WebApp Scope\" FROM programs WHERE name == \'%s\'" % cProgram
    cur.execute(statem)
    rows = cur.fetchone()
    a = str(rows[0]).split(' , ')
    return a

def findScopeTable(conn, a, b):
    cur = conn.cursor()
    statem = "SELECT name FROM sqlite_master WHERE type='table' AND name=\'"+a+"\'"
    try:   
        cur.execute(statem)
        if cur.fetchone():
            # table exists
            print
        else:
            # create table and add data
            cur.execute("CREATE TABLE IF NOT EXISTS \"%s\"(Endpoints TEXT, Parameters TEXT, \"POST Data\" TEXT)" %a)

            cur.execute("INSERT OR IGNORE INTO %s" %a)
            
    except Exception, e:
        pdb.set_trace()
        print e
        exit()

def cleanBrutesubs():
    try:
        subprocess.call('rm -d -r ~/arsenal/recon/brutesubs/myoutdir/*', err=p.communicate(), shell=True)
    except:
        pass

@timeout(1)
def callBrutesubs(a):
    subprocess.call("cd ~/arsenal/recon/brutesubs && sh ./brutesubs.sh "+a+" %s_output "%a, shell=True)
    print a
    test = subprocess.check_output('cat ~/arsenal/recon/brutesubs/myoutdir/'+a+'_output.txt', shell=True)
    return test

def soleDomainAdd(a):
    print a
    #print

def main():
    conn = create_dbConnection()

    #connection action block
    cScope = select_webAppScope(conn)
    for a in cScope:
        cleanBrutesubs()
        #pdb.set_trace()
        try:
            if (a[:2] == '*.'):
                a = a[2:]
                b = callBrutesubs(a):
                findScopeTable(conn, sys.argv[1]+'_'+a, b)
            else:
                soleDomainAdd(a)
        except Exception, e:
            print '[-]',a,'something went wrong:',e

if __name__=='__main__':
    main()
