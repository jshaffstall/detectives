def process_info(info, site):
    # Use this to build up a dictionary of mappings of mysteries to
    # categories, series, etc
    #
    # Then create filters that can be used to ask for all the mysteries
    # belonging to a particular category, series, etc
    #
    # {% 'time travel' | categories %}
    # {% 'magic tree house' | series %}
    
    # Start with letting mysteries put category tags in, and collecting those
    # identify mysteries by layout?  
    
    if 'layout' in info and info['layout'] == 'mystery':
        print (info['title'])
        
