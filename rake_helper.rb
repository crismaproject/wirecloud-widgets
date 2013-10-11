require 'nokogiri'

def create_doc_for(file, output)
  file = File.open file
  doc = Nokogiri::XML(file)
  file.close

  endpoints = {
      :in => doc.css('InputEndpoint').collect { |x| create_hash(x) }.sort { |x, y| x[:name] <=> y[:name] },
      :out => doc.css('OutputEndpoint').collect { |x| create_hash(x) }.sort { |x, y| x[:name] <=> y[:name] }
  }

  File.open(output, 'w') do |f|
    f.puts "# Notice\n\n"
    f.puts "This document has been generated automatically on #{Time.now}. If this file is not up to date, please (re-)run `rake doc` from the command-line.\n\n"

    write_overview f, endpoints
    write_endpoints f, endpoints[:in], 'Input endpoints'
    write_endpoints f, endpoints[:out], 'Output endpoints'
  end
end

def run_process(process)
  begin
    IO.popen(process, 'r') do |p|
      return p.gets.strip
    end
  rescue
    return nil
  end
end

def create_hash(endpoint)
  {
      :name => endpoint[:name],
      :friendcode => endpoint[:friendcode],
      :description => endpoint[:description],
      :label => endpoint[:label],
      :documentation => endpoint.xpath('.//doc:Documentation/text()', {:doc => 'crisma://documentation'}).collect { |x| x.text.strip.gsub(/\s{2,}/, ' ') }.shift
  }
end

def write_overview(f, endpoints)
  f.puts "# Overview\n\n"
  f.puts "**Declared inputs:** #{endpoints[:in].collect { |x| x[:name] }.join(', ')}\n\n"
  f.puts "**Declared outputs:** #{endpoints[:out].collect { |x| x[:name] }.join(', ')}\n\n"
end

def write_endpoints(f, endpoints, title)
  f.puts "# #{title}\n\n"

  if endpoints.empty?
    f.puts "(none)\n\n"
  else
    endpoints.each do |endpoint|
      f.puts "## #{endpoint[:label]}\n\n"
      f.puts "**Internal name:** `#{endpoint[:name]}`\n\n"
      f.puts "**Friendcode:** `#{endpoint[:friendcode]}`\n\n"
      f.puts "**Description:** #{endpoint[:description]}\n\n" if endpoint[:description]
      f.puts "#{endpoint[:documentation]}\n\n" if endpoint[:documentation]
    end
  end
end